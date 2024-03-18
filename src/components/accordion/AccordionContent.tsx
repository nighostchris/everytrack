import clsx from 'clsx';
import React from 'react';
import { Content } from '@radix-ui/react-accordion';

export const AccordionContent = React.forwardRef<React.ElementRef<typeof Content>, React.ComponentPropsWithoutRef<typeof Content>>(
  ({ className, children, ...props }, ref) => (
    <Content
      ref={ref}
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all"
      {...props}
    >
      <div className={clsx('pb-4 pt-0', className)}>{children}</div>
    </Content>
  ),
);

AccordionContent.displayName = Content.displayName;

export default AccordionContent;
