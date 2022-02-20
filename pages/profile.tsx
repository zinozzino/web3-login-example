import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { FC } from 'react';

import Header from '~/components/header';
import Layout from '~/components/layout';
import Main from '~/components/main';
import Toolbar from '~/components/toolbar';
import useProtected from '~/hooks/useProtected';
import getServerSideSession from '~/utils/getServerSideSession';

const Page: FC = () => {
  const isLoggedIn = useProtected({ redirect: '/api/auth/signin' });

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
        <Toolbar title="My Wallets">
          <Link href="/new-wallet">
            <a
              className={clsx(
                'grid grid-flow-col gap-2 items-center',
                'px-3 py-2',
                'border-[1px] border-gray-400 rounded-md',
                'bg-white hover:bg-gray-100 active:bg-gray-200'
              )}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add New Wallet
            </a>
          </Link>
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
              <tr className="border-b-[1px] border-gray-200">
                <td className="py-2">
                  <pre>
                    <code>a7539499cfd5468ced1ba800e93105db</code>
                  </pre>
                </td>
                <td className="py-2 text-center">
                  <button
                    type="button"
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
            </tbody>
          </table>
        </div>
      </Main>
    </Layout>
  );
};

export const getServerSideProps = getServerSideSession();

export default Page;
