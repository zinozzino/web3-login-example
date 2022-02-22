import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC } from 'react';

const Header: FC = () => {
  const { data: session } = useSession();

  const username = session?.user?.name ?? session?.user?.email ?? '';

  return (
    <header
      className={clsx([
        'h-16',
        'flex flex-row items-center justify-center',
        'border-b-2 border-b-black',
      ])}
    >
      <section
        className={clsx([
          'w-full max-w-[1280px]',
          'px-8',
          'flex flex-row items-center justify-between',
        ])}
      >
        <Link href="/">
          <a className="text-2xl">Takehome</a>
        </Link>
        <div className="grid grid-flow-col gap-4">
          {session ? (
            <>
              <Link href="/profile">
                <a>{username}</a>
              </Link>
              <button type="button" onClick={() => signOut()}>
                Log out
              </button>
            </>
          ) : (
            <Link href="/auth/signin">Log in</Link>
          )}
        </div>
      </section>
    </header>
  );
};

export default Header;
