import clsx from 'clsx';
import React from 'react';
import { Item } from '@radix-ui/react-accordion';

export const AccordionItem = React.forwardRef<React.ElementRef<typeof Item>, React.ComponentPropsWithoutRef<typeof Item>>(
  ({ className, ...props }, ref) => <Item ref={ref} className={clsx('bg-white px-6 py-4 md:px-8', className)} {...props} />,
);

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
