import clsx from 'clsx';
import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

export const TabsList = React.forwardRef<React.ElementRef<typeof Tabs.List>, React.ComponentPropsWithoutRef<typeof Tabs.List>>(
  ({ className, ...props }, ref) => (
    <Tabs.List
      ref={ref}
      className={clsx('inline-flex h-10 w-full items-center justify-center rounded-lg bg-gray-200 p-2', className)}
      {...props}
    />
  ),
);

TabsList.displayName = Tabs.List.displayName;

export default TabsList;
