/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { LuLoader2 } from 'react-icons/lu';

import { IconButton } from './IconButton';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'contained' | 'outlined';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, isLoading = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={clsx(
          className,
          {
            'border border-gray-200 bg-white hover:border-gray-300': variant === 'outlined',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100': variant === 'contained',
          },
          'inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        )}
      >
        {isLoading && <LuLoader2 className="h-6 w-6 animate-spin" />}
        {!isLoading && children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { IconButton };

export default Button;
