/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { Trigger } from '@radix-ui/react-select';

interface SelectTriggerProps {
  error?: string;
}

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof Trigger>,
  React.ComponentPropsWithoutRef<typeof Trigger> & SelectTriggerProps
>(({ error, className, children, ...props }, ref) => {
  return (
    <Trigger
      ref={ref}
      {...props}
      className={clsx(
        className,
        { 'border-red-300': error },
        // dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900
        'flex min-h-[40px] w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      {children}
      <FaChevronDown className="h-4 w-4 opacity-50" />
    </Trigger>
  );
});

SelectTrigger.displayName = Trigger.displayName;

export default SelectTrigger;
