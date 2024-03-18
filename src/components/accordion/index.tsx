import clsx from 'clsx';
import React from 'react';
import { Root } from '@radix-ui/react-accordion';

import AccordionItem from './AccordionItem';
import AccordionTrigger from './AccordionTrigger';
import AccordionContent from './AccordionContent';

interface AccordionProps {
  className?: string;
  children?: React.ReactNode;
}

export const Accordion = React.forwardRef<React.ElementRef<typeof Root>, AccordionProps>(({ className, children }, ref) => {
  return (
    <Root type="multiple" className={clsx('w-full overflow-hidden rounded-lg shadow-sm', className)} ref={ref}>
      {children}
    </Root>
  );
});

Accordion.displayName = 'Accordion';

export { AccordionItem, AccordionTrigger, AccordionContent };

export default Accordion;
