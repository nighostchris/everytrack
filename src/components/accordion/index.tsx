import clsx from 'clsx';
import React from 'react';
import { Root } from '@radix-ui/react-accordion';

import AccordionItem from './AccordionItem';
import AccordionTrigger from './AccordionTrigger';
import AccordionContent from './AccordionContent';

interface AccordionProps {
  className?: string;
}

export const Accordion = React.forwardRef<React.ElementRef<typeof Root>, AccordionProps>(({ className }, ref) => {
  return (
    <Root type="multiple" className={clsx('w-full overflow-hidden rounded-lg shadow-sm', className)}>
      <AccordionItem value="item-1" className="border-b border-gray-200">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-b border-gray-200">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It comes with default styles that matches the other components&apos; aesthetic.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It&apos;s animated by default, but you can disable it if you prefer.</AccordionContent>
      </AccordionItem>
    </Root>
  );
});

Accordion.displayName = 'Accordion';

export default Accordion;
