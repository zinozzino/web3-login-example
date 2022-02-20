import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

const Page: FC = () => (
  <article
    className={clsx(['w-full min-h-screen', 'flex flex-col items-stretch'])}
  >
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
        <div>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </section>
    </header>
  </article>
);

export default Page;
