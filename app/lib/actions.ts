'use server'

import { z } from 'zod'
import { createUser, updateUserById } from '@/src/db/queries';
import { signIn } from "@/auth"
// const argon2 = require('argon2');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { fromBase64, fromBuffer, fromPath } from "pdf2pic";
import Tesseract, { createWorker } from 'tesseract.js';
const randomstring = require('randomstring');

const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN!;

const client = new S3Client({
  credentials: awsCredentialsProvider({
    roleArn: AWS_ROLE_ARN,
  }),
});

// TODO: CONFORM TO NEW FILE STRUCTURE & READ FROM PROCESSED BUCKET INSTEAD
export const GetFileFromBucket = async (file: string) => {
    const command = new GetObjectCommand({
        Bucket: "vance29834",
        Key: file,
    });

    try {
        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        return await url;
    } catch (err) {
        console.error(err);
    }
}

let isSetCreated = false;
export async function CreateSet(user: any, setName: string, parentFolder: string, fileUintarr: Uint8Array, pageCount: number) {
  const buffer = Buffer.from(fileUintarr);
  console.log("🚀 ~ CreateSet ~ buffer:", buffer);
  const hash = randomstring.generate(44);
  
  // Upload the file to the S3 bucket
  const command = new PutObjectCommand({
    Bucket: "vance29834",
    Body: buffer,
    Key: (user.id as string) + "/" + "file" + hash + ".pdf",
  });
  const response = await client.send(command);
  console.log("🚀 ~ CreateSet ~ response:", response)

  // Update user's content json with the new set
  const newStructure = RecurseFilesCreateSet(user.content, parentFolder, setName, hash);
  isSetCreated = false;
  console.log(await updateUserById(user.id as string, {
    content: newStructure
  }));
  return newStructure;
}

function RecurseFilesCreateSet(files: any, parentFolder: string, setName: string, hash: string){
  let res = files;
  for(const item in res){
    if(isSetCreated) return res;

    if(typeof res[item] === 'string') continue;

    if(item === parentFolder){
      res[item][setName] = "file" + hash + ".pdf";
      isSetCreated = true;
      return res;
    }
    res = {
      ...res,
      [item]: RecurseFilesCreateSet(res[item], parentFolder, setName, hash)
    }
  }
  return res;
}

let isAdded = false;
export async function AddFolder(parentFolder: string, prospectiveFolder: string, files: any, user: any){
  const newStructure = RecurseFilesFindTargetFolder(files, parentFolder, prospectiveFolder)
  isAdded = false;
  console.log(await updateUserById(user.id as string, {
    content: newStructure
  }));
  return newStructure;
}

function RecurseFilesFindTargetFolder(files: any, targetFolder: string, prospectiveFolder: any){
  let res = files;
  for(const item in res){
    if(isAdded) return res;

    // Check if the value of the current item is a string, which would indicate that the current item is a file and not a folder
    if(typeof res[item] === 'string') continue;

    // Otherwise the current item is a folder
    if(item === targetFolder){
      if(prospectiveFolder in res[item]){
        return res;
      }
      res[item][prospectiveFolder] = {};
      isAdded = true;
      return res;
    }
    // Recurse the subfolder if the current folder is not the targetFolder
    res = {
      ...res,
      [item]: RecurseFilesFindTargetFolder(res[item], targetFolder, prospectiveFolder)
    }
  }
  return res;
}

let isDeleted = false;
export async function DeleteFolder(targetFolder: any, files: any, user: any){
  const newStructure = RecurseFilesDeleteTargetFolder(targetFolder, files);
  isDeleted = false;
  console.log("🚀 ~ DeleteFolder ~ newStructure:", newStructure)
  console.log(await updateUserById(user.id as string, {
    content: newStructure
  }));
  return newStructure;
}

function RecurseFilesDeleteTargetFolder(targetFolder: any, files: any) : any{
  let res = files;
  for(const item in res){
    if(isDeleted) return res;
    console.log("🚀 ~ RecurseFilesDeleteTargetFolder ~ item:", item)
    if(typeof res[item] === 'string') continue;

    if(item === targetFolder){
      delete res[item];
      isDeleted = true;
      return res;
    }
    res = {
      ...res,
      [item]: RecurseFilesDeleteTargetFolder(targetFolder, res[item])
    }
  }
  return res;
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  pw: z.string(),
  content: z.any(),
  misc: z.any(),
})

const SignUp = FormSchema.omit({ id: true })

// export async function signUp(formData: FormData){
//   if(formData.get('agree') != 'on' || formData.get('repeat-password') != formData.get('password')){
//     throw new Error('Invalid data');
//     return null;
//   }

//   try{
//     const hash = await argon2.hash(formData.get('password'))

//     const { name, email, pw, content, misc } = SignUp.parse({
//       name: formData.get('username'),
//       email: formData.get('email'),
//       pw: await hash,
//       content: {
//         files: {}
//       },
//       misc: {}
//     });

//     createUser(await {
//       name, email, pw, content, misc
//     });
//   } catch (err) {
//     console.log("Error in hashing password:", err)
//   }
// }