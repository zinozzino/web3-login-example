import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

export interface PagePropsWithSession {
  session: Session | null;
}

function getServerSideSession<Props>(
  getServerSideProps?: GetServerSideProps<Props>
) {
  return async (ctx: GetServerSidePropsContext) => {
    const result = await getServerSideProps?.(ctx);

    const session = await getSession(ctx);

    if (result == null) {
      return {
        props: {
          session,
        },
      };
    }

    if ('props' in result) {
      return {
        props: {
          ...result.props,
          session,
        },
      };
    }

    return result;
  };
}

export default getServerSideSession;
