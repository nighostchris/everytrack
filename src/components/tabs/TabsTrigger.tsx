/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

export const TabsTrigger = React.forwardRef<React.ElementRef<typeof Tabs.Trigger>, React.ComponentPropsWithoutRef<typeof Tabs.Trigger>>(
  ({ className, ...props }, ref) => (
    <Tabs.Trigger
      ref={ref}
      className={clsx(
        'inline-flex w-full items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium text-gray-500 ring-offset-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow',
        className,
      )}
      {...props}
    />
  ),
);

TabsTrigger.displayName = Tabs.Trigger.displayName;

export default TabsTrigger;
