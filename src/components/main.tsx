import clsx from 'clsx';
import { FC } from 'react';

export interface MainProps {
  className?: string;
}

const Main: FC<MainProps> = ({ className, children }) => (
  <main className={clsx('flex-1', 'pt-8', 'flex flex-col items-center')}>
    <article className={clsx('w-full max-w-[1280px]', 'px-8', className)}>
      {children}
    </article>
  </main>
);

export default Main;
