/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={clsx(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-gray-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
));

DropdownMenuItem.displayName = DropdownMenu.Item.displayName;

export default DropdownMenuItem;
