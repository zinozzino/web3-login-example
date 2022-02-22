import axios from 'axios';
import clsx from 'clsx';
import { GetServerSidePropsContext } from 'next';
import { getCsrfToken, getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import { FC, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';

import { IS_METAMASK_ENABLED } from '~/config';
import getHash from '~/utils/getHash';
import getRandom from '~/utils/getRandom';

const EmailLogin: FC = () => {
  const [email, setEmail] = useState('');

  const handleSignIn = () => {
    signIn('email', { email });
  };

  return (
    <>
      <input
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
        className={clsx('text-field')}
      />
      <button
        type="button"
        onClick={handleSignIn}
        className={clsx('btn', 'border-gray-300 border-[1px]')}
      >
        Login with Email
      </button>
    </>
  );
};

interface PageProps {
  csrfToken: string;
}

const Page: FC<PageProps> = () => {
  const handleMetamask = async () => {
    const web3 = new Web3(window.ethereum);

    let nonce: number;

    if (!IS_METAMASK_ENABLED) {
      toast.error('metamask not installed');
      return;
    }

    const address = await web3.eth.getCoinbase();

    try {
      const response = (
        await axios.get<{ nonce: number }>(
          `/api/find-wallet?address=${address}`
        )
      ).data;
      nonce = response.nonce;
    } catch (err) {
      // TODO: generate temp session
      nonce = getRandom();
    }

    const data = getHash(nonce);

    const signedMessage = await web3.eth.personal.sign(data, address, '');

    await signIn('metamask', {
      address,
      signedMessage,
      nonce,
    });
  };
  const handleGoogle = () => signIn('google');
  const handleDiscord = () => signIn('discord');
  const handleTwitter = () => signIn('twitter');

  return (
    <div
      className={clsx('min-h-screen flex flex-col items-center justify-center')}
    >
      <Head>
        <title>Sign In</title>
      </Head>
      <div
        className={clsx(
          'max-w-[20rem] grid grid-flow-row p-8 border-gray-200 border-[1px]',
          'divide-y'
        )}
      >
        <div className={clsx('grid grid-flow-row gap-4', 'py-4')}>
          <EmailLogin />
        </div>
        <div className={clsx('grid grid-flow-row gap-4', 'py-4')}>
          <button
            type="button"
            onClick={handleMetamask}
            className={clsx('btn', 'border-gray-300 border-[1px]')}
          >
            Login with Metamask
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            className={clsx('btn', 'border-gray-300 border-[1px]')}
          >
            Login with Google
          </button>
          <button
            type="button"
            onClick={handleDiscord}
            className={clsx('btn', 'border-gray-300 border-[1px]')}
          >
            Login with Discord
          </button>
          <button
            type="button"
            onClick={handleTwitter}
            className={clsx('btn', 'border-gray-300 border-[1px]')}
          >
            Login with Twitter
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: session.user.email ? '/' : '/auth/new-user',
      },
    };
  }

  const csrfToken = await getCsrfToken(ctx);

  return {
    props: {
      csrfToken,
    },
  };
};

export default Page;
