import clsx from 'clsx';
import React from 'react';
import { Command } from 'cmdk';

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof Command.Separator>,
  React.ComponentPropsWithoutRef<typeof Command.Separator>
>(({ className, ...props }, ref) => <Command.Separator ref={ref} className={clsx('bg-border -mx-1 h-px', className)} {...props} />);
CommandSeparator.displayName = Command.Separator.displayName;

export default CommandSeparator;
