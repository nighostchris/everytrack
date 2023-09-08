/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';

import Spinner from '../spinner';

interface LoadingButtonProps {
  label: string;
  type: 'button' | 'submit';
  onClick?: any;
  className?: string;
  isLoading?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({ type, label, onClick, isLoading, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        className,
      )}
    >
      {typeof isLoading !== 'undefined' && isLoading ? <Spinner isLoading={isLoading} /> : label}
    </button>
  );
};

export default LoadingButton;
