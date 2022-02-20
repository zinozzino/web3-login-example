import { FC } from 'react';

import Header from '~/components/header';
import Layout from '~/components/layout';
import Main from '~/components/main';
import Toolbar from '~/components/toolbar';
import getServerSideSession from '~/utils/getServerSideSession';

const Page: FC = () => (
  <Layout>
    <Header />
    <Main>
      <Toolbar title="New Wallet" />
    </Main>
  </Layout>
);

export const getServerSideProps = getServerSideSession();

export default Page;
