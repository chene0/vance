import NextAuth, { User } from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { ZodError } from 'zod';
import { signInSchema } from "./app/lib/zod"
import { getUserByCredentials } from './src/db/queries';
const argon2 = require('argon2');
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try{
          let user = null;

          const { email, password } = await signInSchema.parseAsync(credentials)

          const pwHash = argon2.hash(password)

          user = await getUserByCredentials(email, pwHash)

          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
          }

          return await user as User;
        }
        catch(err){
          if(err instanceof ZodError){
            throw new Error(err.errors.map(e => e.message).join(", "))
          }
          throw new Error('Wrong credentials')
        }
      },
    }),
  ],
});