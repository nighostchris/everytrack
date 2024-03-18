import clsx from 'clsx';
import React from 'react';
import { RxChevronDown } from 'react-icons/rx';
import { Header, Trigger } from '@radix-ui/react-accordion';

export const AccordionTrigger = React.forwardRef<React.ElementRef<typeof Trigger>, React.ComponentPropsWithoutRef<typeof Trigger>>(
  ({ className, children, ...props }, ref) => (
    <Header className="flex">
      <Trigger
        ref={ref}
        className={clsx(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <RxChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </Trigger>
    </Header>
  ),
);

AccordionTrigger.displayName = Trigger.displayName;

export default AccordionTrigger;
