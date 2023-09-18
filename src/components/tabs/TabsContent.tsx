import clsx from 'clsx';
import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

export const TabsContent = React.forwardRef<React.ElementRef<typeof Tabs.Content>, React.ComponentPropsWithoutRef<typeof Tabs.Content>>(
  ({ className, ...props }, ref) => (
    <Tabs.Content
      ref={ref}
      className={clsx(
        'mt-2 ring-offset-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  ),
);

TabsContent.displayName = Tabs.Content.displayName;

export default TabsContent;
