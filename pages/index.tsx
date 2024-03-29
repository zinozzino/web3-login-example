import Head from 'next/head';
import { FC } from 'react';

import Header from '~/components/header';
import Layout from '~/components/layout';
import getServerSideSession from '~/utils/getServerSideSession';

const Page: FC = () => (
  <Layout>
    <Head>
      <title>Welcome home! - Takehome</title>
    </Head>
    <Header />
  </Layout>
);

export const getServerSideProps = getServerSideSession();

export default Page;
