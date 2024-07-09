import type { NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }){
      const isLoggedIn = !!auth?.user;
      const isOnWorkspace = nextUrl.pathname.startsWith('/workspace');
      if (isOnWorkspace) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/workspace', nextUrl));
      }
      return true;
    },
    async session({ session, user, token }) {
      return session
    },
  },
  providers: [credentials],
} satisfies NextAuthConfig;