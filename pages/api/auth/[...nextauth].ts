import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

import prisma, { PrismaAdapter } from '~/prisma';

const adapter = PrismaAdapter(prisma);

export default NextAuth({
  adapter,
  providers: [
    // CredentialsProvider({
    //   id: 'metamask',
    //   name: 'Metamask',
    //   credentials: {},
    //   async authorize(credentials, req) {
    //     const user = null;
    //     return user;
    //   },
    // }),
    // Passwordless / email sign in
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async session({ session, user }) {
      return { ...session, user: { ...user, id: user.id } };
    },
    async jwt({ token, user }) {
      return { ...token, user: user ? { id: user.id } : null };
    },
  },
});
