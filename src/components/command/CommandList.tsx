import clsx from 'clsx';
import React from 'react';
import { Command } from 'cmdk';

export const CommandList = React.forwardRef<React.ElementRef<typeof Command.List>, React.ComponentPropsWithoutRef<typeof Command.List>>(
  ({ className, ...props }, ref) => (
    <Command.List ref={ref} className={clsx('max-h-[300px] overflow-y-auto overflow-x-hidden', className)} {...props} />
  ),
);

CommandList.displayName = Command.List.displayName;

export default CommandList;
