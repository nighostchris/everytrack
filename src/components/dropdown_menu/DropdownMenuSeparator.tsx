import clsx from 'clsx';
import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Separator ref={ref} className={clsx('-mx-1 my-1 h-px bg-gray-200', className)} {...props} />
));

DropdownMenuSeparator.displayName = DropdownMenu.Separator.displayName;

export default DropdownMenuSeparator;
