'use server'

import { z } from 'zod'
import { createUser } from '@/src/db/queries';
import { signIn } from "@/auth"
const argon2 = require('argon2');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
const fs = require('fs');

const client = new S3Client({});

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


const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  pw: z.string(),
  content: z.any(),
  misc: z.any(),
})

const SignUp = FormSchema.omit({ id: true })

export async function signUp(formData: FormData){
  if(formData.get('agree') != 'on' || formData.get('repeat-password') != formData.get('password')){
    throw new Error('Invalid data');
    return null;
  }

  try{
    const hash = await argon2.hash(formData.get('password'))

    const { name, email, pw, content, misc } = SignUp.parse({
      name: formData.get('username'),
      email: formData.get('email'),
      pw: await hash,
      content: {
        files: {}
      },
      misc: {}
    });

    createUser(await {
      name, email, pw, content, misc
    });
  } catch (err) {
    console.log("Error in hashing password:", err)
  }
}