import { FC } from 'react';

import Header from '~/components/header';
import Layout from '~/components/layout';
import getServerSideSession from '~/utils/getServerSideSession';

const Page: FC = () => (
  <Layout>
    <Header />
  </Layout>
);

export const getServerSideProps = getServerSideSession();

export default Page;
