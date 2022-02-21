import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Account, Wallet } from '@prisma/client';
import axios from 'axios';
import clsx from 'clsx';
import isNil from 'lodash/isNil';
import { getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import Header from '~/components/header';
import Layout from '~/components/layout';
import Main from '~/components/main';
import Toolbar from '~/components/toolbar';
import { IS_METAMASK_ENABLED } from '~/config';
import useProtected from '~/hooks/useProtected';
import prisma from '~/prisma';
import getServerSideSession from '~/utils/getServerSideSession';
import isNonNullArray from '~/utils/isNonNullArray';

const queryKey = '/api/wallets';

interface PageProps {
  accounts: Account[];
  providers: Awaited<ReturnType<typeof getProviders>>;
}

const Page: FC<PageProps> = ({ accounts, providers }) => {
  const queryClient = useQueryClient();
  const isLoggedIn = useProtected({ redirect: '/api/auth/signin' });
  const { data } = useQuery(
    queryKey,
    async () => (await axios.get<{ wallets: Wallet[] }>(queryKey)).data.wallets
  );

  const createWallet = useMutation(
    async () => {
      if (!IS_METAMASK_ENABLED) {
        throw new Error('metamask not installed');
      }

      const addresses = await window.ethereum.request<string[]>({
        method: 'eth_requestAccounts',
      });

      if (isNonNullArray(addresses)) {
        return (
          await axios.post<{ wallets: Wallet[] }>(queryKey, { addresses })
        ).data;
      }

      return { wallets: [] };
    },
    {
      onSuccess(newData) {
        toast.success('wallets added.');

        queryClient.setQueryData<Wallet[]>('/api/wallets', wallets => [
          ...(wallets ?? []),
          ...newData.wallets,
        ]);
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message ?? 'failed to add wallet');
        } else {
          toast.error((error as Error).message ?? 'failed to add wallet');
        }
      },
    }
  );

  const removeWallet = useMutation(
    (walletId: string) => axios.delete(`/api/wallets/${walletId}`),
    {
      onSuccess(_, walletId) {
        queryClient.setQueryData<Wallet[]>(
          '/api/wallets',
          wallets => wallets?.filter(({ id }) => id !== walletId) ?? []
        );
      },
    }
  );

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>My Profile - Takehome</title>
      </Head>
      <Header />
      <Main>
        <Toolbar title="Link Accounts" />
        <div className="p-4 grid grid-flow-row gap-4">
          {providers &&
            Object.entries(providers)
              .filter(([provider]) => provider !== 'email')
              .map(([provider]) => {
                const account = accounts.find(acc => acc.provider === provider);

                return (
                  <div
                    key={provider}
                    className={clsx('flex flex-row justify-between')}
                  >
                    <p>{provider}</p>
                    {account ? (
                      <p className={clsx('text-green-500')}>Linked</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => signIn(provider)}
                        className={clsx('btn', 'bg-green-400')}
                      >
                        Link
                      </button>
                    )}
                  </div>
                );
              })}
        </div>
        <Toolbar title="My Wallets">
          <button
            type="button"
            onClick={() => createWallet.mutate()}
            className={clsx(
              'btn',
              'bg-green-400 hover:bg-green-500 active:bg-green-600'
            )}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Wallet via Metamask
          </button>
        </Toolbar>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b-[1px] border-gray-200">
                <th className="py-2">Wallet ID</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!isNil(data) &&
                data.map(wallet => (
                  <tr
                    key={`wallet-${wallet.id}`}
                    className="border-b-[1px] border-gray-200"
                  >
                    <td className="py-2">
                      <pre>
                        <code>{wallet.address}</code>
                      </pre>
                    </td>
                    <td className="py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeWallet.mutate(wallet.id)}
                        className={clsx(
                          'rounded-md px-3 py-2',
                          'bg-red-500 hover:bg-red-600 active:bg-red-700',
                          'text-sm text-white'
                        )}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Main>
    </Layout>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const getServerSideProps = getServerSideSession<PageProps>(async ctx => {
  const { id: userId } = ctx.session?.user ?? {};

  const accounts = await prisma.account.findMany({ where: { userId } });

  const providers = await getProviders();

  return {
    props: {
      accounts,
      providers,
    },
  };
});

export default Page;
