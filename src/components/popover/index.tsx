/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Root, Content, Trigger } from '@radix-ui/react-popover';

export const Popover = Root;

export const PopoverTrigger = Trigger;

export const PopoverContent = React.forwardRef<React.ElementRef<typeof Content>, React.ComponentPropsWithoutRef<typeof Content>>(
  ({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={clsx(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-60 w-72 rounded-md border border-gray-300 bg-white p-4 shadow-md outline-none ',
        className,
      )}
      {...props}
    />
  ),
);

PopoverContent.displayName = Content.displayName;
