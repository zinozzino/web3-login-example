import clsx from 'clsx';
import { FC } from 'react';

const Layout: FC = ({ children }) => (
  <article
    className={clsx(['w-full min-h-screen', 'flex flex-col items-stretch'])}
  >
    {children}
  </article>
);

export default Layout;
