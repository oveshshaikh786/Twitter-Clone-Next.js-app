import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github'; // or Google, etc.
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../../../libs/db';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      // On sign-in
      if (user) {
        token.id = user.id || user._id; // Ensure ID is passed from DB
      }
      return token;
    },

    async session({ token, session }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
