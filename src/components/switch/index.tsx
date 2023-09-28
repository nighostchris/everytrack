/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Root, Thumb } from '@radix-ui/react-switch';

export const Switch = React.forwardRef<React.ElementRef<typeof Root>, React.ComponentPropsWithoutRef<typeof Root> & { label?: string }>(
  ({ label, className, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium leading-none text-gray-700">{label}</label>}
      <Root
        className={clsx(
          'peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300',
          className,
        )}
        {...props}
        ref={ref}
      >
        <Thumb
          className={clsx(
            'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
          )}
        />
      </Root>
    </div>
  ),
);

Switch.displayName = Root.displayName;

export default Switch;
