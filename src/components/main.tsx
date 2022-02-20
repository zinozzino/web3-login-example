import clsx from 'clsx';
import { FC } from 'react';

const Main: FC = ({ children }) => (
  <main className={clsx('flex-1', 'w-full max-w-[1280px]', 'px-8 pt-8')}>
    {children}
  </main>
);

export default Main;
