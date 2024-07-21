'use server'

import { z } from 'zod'
import { createUser, updateUserById } from '@/src/db/queries';
import { signIn } from "@/auth"
// const argon2 = require('argon2');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { redirect } from 'next/navigation';

const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN!;

const client = new S3Client({
  credentials: awsCredentialsProvider({
    roleArn: AWS_ROLE_ARN,
  }),
});

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

export async function AddFolder(parentFolder: string, prospectiveFolder: string, files: any, user: any){
  const newStructure = RecurseFilesFindTargetFolder(files, parentFolder, prospectiveFolder)
  console.log(await updateUserById(user.id as string, {
    content: newStructure
  }));
  return newStructure;
}

function RecurseFilesFindTargetFolder(files: any, targetFolder: string, prospectiveFolder: any){
  let res = files;
  for(const item in res){
    // Check if the value of the current item is a string, which would indicate that the current item is a file and not a folder
    if(typeof res[item] === 'string') continue;

    // Otherwise the current item is a folder
    if(item === targetFolder){
      if(prospectiveFolder in res[item]){
        return null;
      }
      res[item][prospectiveFolder] = {};
      return res;
    }
    // Recurse the subfolder if the current folder is not the targetFolder
    return RecurseFilesFindTargetFolder(res, targetFolder, prospectiveFolder)
  }
  return null;
}

export async function DeleteFolder(targetFolder: any, files: any){
  
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