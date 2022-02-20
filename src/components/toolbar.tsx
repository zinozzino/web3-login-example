import clsx from 'clsx';
import { FC } from 'react';

export interface ToolbarProps {
  title: string;
}

const Toolbar: FC<ToolbarProps> = ({ title, children }) => (
  <div
    className={clsx(
      'flex flex-row justify-between items-center',
      'pb-4',
      'border-b-2 border-b-gray-400 border-opacity-70'
    )}
  >
    <h1 className="text-3xl">{title}</h1>
    <div>{children}</div>
  </div>
);

export default Toolbar;
