import * as sigUtil from 'eth-sig-util';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

import prisma, { PrismaAdapter } from '~/prisma';
import getHash from '~/utils/getHash';

const adapter = PrismaAdapter(prisma);

export default NextAuth({
  adapter,
  providers: [
    CredentialsProvider({
      id: 'metamask',
      name: 'Metamask',
      credentials: {
        address: {
          type: 'string',
          placeholder: '',
        },
        signedMessage: {
          type: 'string',
          placeholder: '',
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { address, signedMessage } = credentials;

        try {
          const wallet = await prisma.wallet.findFirst({
            select: { nonce: true, user: true },
            where: { address },
          });

          if (!wallet) {
            return null;
          }

          const data = getHash(wallet.nonce);

          const recovered = sigUtil.recoverPersonalSignature({
            data,
            sig: signedMessage,
          });

          if (recovered !== address) {
            return null;
          }

          return wallet.user;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
          return null;
        }
      },
    }),
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
      version: '1.0a',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session(params) {
      const { session, token } = params;

      return { ...session, user: { ...session.user, id: `${token.sub}` } };
    },
  },
});
