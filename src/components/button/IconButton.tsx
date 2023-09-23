/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { IconBase } from 'react-icons';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: typeof IconBase;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ icon: Icon, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={clsx(
        className,
        'inline-flex items-center justify-center rounded-md border border-gray-400 bg-transparent text-sm font-medium shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-40',
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
