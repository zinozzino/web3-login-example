import isNil from 'lodash/isNil';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface UseProtectedProps {
  redirect?: string;
}

function useProtected({
  redirect,
}: UseProtectedProps | undefined = {}): boolean {
  const router = useRouter();
  const { data: session } = useSession();

  const isLoggedIn = !isNil(session);

  useEffect(() => {
    if (!isLoggedIn && !isNil(redirect)) {
      router.replace(redirect);
    }
  }, [router, isLoggedIn, redirect]);

  return isLoggedIn;
}

export default useProtected;
