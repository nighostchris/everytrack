/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { RxCaretSort } from 'react-icons/rx';
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
        'flex min-h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-gray-400',
      )}
    >
      {children}
      <RxCaretSort className="h-5 w-5 text-black opacity-50" />
    </Trigger>
  );
});

SelectTrigger.displayName = Trigger.displayName;

export default SelectTrigger;
