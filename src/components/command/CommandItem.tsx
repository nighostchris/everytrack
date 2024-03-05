/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Command } from 'cmdk';

export const CommandItem = React.forwardRef<React.ElementRef<typeof Command.Item>, React.ComponentPropsWithoutRef<typeof Command.Item>>(
  ({ className, ...props }, ref) => (
    <Command.Item
      ref={ref}
      className={clsx(
        'relative flex cursor-default select-none items-center text-sm outline-none hover:cursor-pointer data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);

CommandItem.displayName = Command.Item.displayName;

export default CommandItem;
