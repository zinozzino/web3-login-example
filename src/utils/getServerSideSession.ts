import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

export interface PagePropsWithSession {
  session: Session | null;
}

function getServerSideSession<Props>(
  getServerSideProps?: (
    // eslint-disable-next-line no-unused-vars
    ctx: GetServerSidePropsContext & { session: Session | null }
  ) => GetServerSidePropsResult<Props>
) {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);

    const result = await getServerSideProps?.({ ...ctx, session });

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
