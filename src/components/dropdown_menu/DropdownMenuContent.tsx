/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={clsx(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </DropdownMenu.Portal>
));

DropdownMenuContent.displayName = DropdownMenu.Content.displayName;

export default DropdownMenuContent;
