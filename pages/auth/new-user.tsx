/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import clsx from 'clsx';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import { FC, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as yup from 'yup';

import getServerSideSession from '~/utils/getServerSideSession';
import sleep from '~/utils/sleep';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().default(''),
});

const Page: FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async () => {
    try {
      const data = await schema.validate({ email, name });

      await axios.post('/api/user', data);

      toast.success('user info filled.');

      await sleep(300);

      signIn('email', { email });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message ?? 'unknown error');
      } else {
        toast.error((error as Error).message ?? 'unknown error');
      }
    }
  };

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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className={clsx('text-field')}
            name="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <label htmlFor="name">name</label>
          <input
            type="text"
            className={clsx('text-field')}
            name="name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
          <button
            type="button"
            onClick={handleSignup}
            className={clsx('btn', 'border-[1px] border-gray-300')}
          >
            Create new User
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export const getServerSideProps = getServerSideSession<Record<string, never>>(
  // @ts-expect-error
  async ctx => {
    if (!ctx.session) {
      return {
        redirect: {
          destination: '/auth/login',
        },
      };
    }

    if (ctx.session.user.email) {
      return {
        redirect: {
          destination: '/',
        },
      };
    }

    return { props: {} };
  }
);

export default Page;
