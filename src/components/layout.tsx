import clsx from 'clsx';
import { FC } from 'react';
import { Toaster } from 'react-hot-toast';

const Layout: FC = ({ children }) => (
  <article
    className={clsx(['w-full min-h-screen', 'flex flex-col items-stretch'])}
  >
    {children}
    <Toaster />
  </article>
);

export default Layout;
