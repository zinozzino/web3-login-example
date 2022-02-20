import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC } from 'react';

const Header: FC = () => {
  const { data: session } = useSession();

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
              <Link href="/profile">{session.user?.name}</Link>
              <Link href="/api/auth/signout">Log out</Link>
            </>
          ) : (
            <Link href="/api/auth/signin">Log in</Link>
          )}
        </div>
      </section>
    </header>
  );
};

export default Header;
