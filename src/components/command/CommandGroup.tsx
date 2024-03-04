/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Command } from 'cmdk';

export const CommandGroup = React.forwardRef<React.ElementRef<typeof Command.Group>, React.ComponentPropsWithoutRef<typeof Command.Group>>(
  ({ className, ...props }, ref) => (
    <Command.Group
      ref={ref}
      className={clsx(
        '[&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
        className,
      )}
      {...props}
    />
  ),
);

CommandGroup.displayName = Command.Group.displayName;

export default CommandGroup;
