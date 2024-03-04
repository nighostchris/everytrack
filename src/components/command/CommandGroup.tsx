/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Command } from 'cmdk';

export const CommandGroup = React.forwardRef<React.ElementRef<typeof Command.Group>, React.ComponentPropsWithoutRef<typeof Command.Group>>(
  ({ className, ...props }, ref) => (
    <Command.Group
      ref={ref}
      className={clsx(
        '[&_[cmdk-group-heading]]:bg-gray-200 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-600',
        className,
      )}
      {...props}
    />
  ),
);

CommandGroup.displayName = Command.Group.displayName;

export default CommandGroup;
