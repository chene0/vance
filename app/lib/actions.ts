'use server'

import { z } from 'zod'
import { createUser, updateUserById } from '@/src/db/queries';
import { signIn } from "@/auth"
// const argon2 = require('argon2');
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { fromBase64, fromBuffer, fromPath } from "pdf2pic";
import Tesseract, { createWorker } from 'tesseract.js';
import fetch from "node-fetch";
import { PDFDocument } from 'pdf-lib';
const randomstring = require('randomstring');

const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN!;

const client = new S3Client({
  credentials: awsCredentialsProvider({
    roleArn: AWS_ROLE_ARN,
  }),
});

export const ProcessFile = async (file: string, numPages: number) => {
  // Create a signed url from each **JPEG** page such that the Tesseract worker can read the image
  for(let i = 0; i < numPages; i++){
    const key = `${file}/${i.toString()}.jpg`;
    const command = new GetObjectCommand({
      Bucket: "vance-processed12093",
      Key: key
    });

    // Get the buffer from the s3 object
    // NOTE: Avoid using signed urls for this as the Tesseract worker will raise "fetch is the a function" error
    const response = client.send(command);
    const bytes = (await response).Body?.transformToByteArray();
    const buffer = Buffer.from(await bytes as Uint8Array);

    (async () => {
      const worker = await createWorker('eng', 1, {workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js"});
      const ret = await worker.recognize(buffer);
      // ret: we are interated in the hocr, which should provide the bounding box of the text
      console.log(ret);
      await worker.terminate();
    })();
    break;
  }
}

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
    Key: "file" + hash + ".pdf",
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

let isSetDeleted = false;
export async function DeleteSet(user: any, files: any, targetSetID: string){
  let numberOfPages = 0;

  const commandForPageCount = new GetObjectCommand({
    Bucket: "vance29834",
    Key: targetSetID,
  });
  try {
    const response = await client.send(commandForPageCount);
    const bytes = (await response).Body?.transformToByteArray();
    const pdfDoc = await PDFDocument.load(await bytes as Uint8Array);
    numberOfPages = pdfDoc.getPageCount();
  } catch (err) {
    console.error(err);
  }

  // Delete any processed images from the S3 bucket
  for(let i = 0; i < numberOfPages; i++){
    const key = `${targetSetID}/${i.toString()}.jpg`;
    const commandForProcessed = new DeleteObjectCommand({
      Bucket: "vance-processed12093",
      Key: key,
    });
    try{
      const response = await client.send(commandForProcessed);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  // Delete the raw pdf from the other S3 bucket
  const commandForRaw = new DeleteObjectCommand({
    Bucket: "vance29834",
    Key: targetSetID,
  })
  try{
    const response = await client.send(commandForRaw);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
  

  // Update user's content json with the set removed
  const newStructure = RecurseFilesDeleteSet(files, targetSetID);
  console.log("🚀 ~ DeleteSet ~ newStructure:", newStructure)
  isSetDeleted = false;
  console.log(await updateUserById(user.id as string, {
    content: newStructure
  }));
  return newStructure;
}
function RecurseFilesDeleteSet(files: any, targetSetID: string) : any{
  let res = files;
  for(const item in res){
    if(isSetDeleted) return res;
    
    if(typeof res[item] === 'string'){
      if(res[item] === targetSetID){
        delete res[item];
        isSetDeleted = true;
        return res;
      }
      continue;
    }
    res = {
      ...res,
      [item]: RecurseFilesDeleteSet(res[item], targetSetID)
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