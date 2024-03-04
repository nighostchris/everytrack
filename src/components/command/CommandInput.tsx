/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Command } from 'cmdk';
import { LuSearch } from 'react-icons/lu';

export const CommandInput = React.forwardRef<React.ElementRef<typeof Command.Input>, React.ComponentPropsWithoutRef<typeof Command.Input>>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <LuSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <Command.Input
        ref={ref}
        className={clsx(
          'flex h-11 w-full rounded-md border-none bg-transparent px-0 py-3 text-sm outline-none focus:border-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
);

CommandInput.displayName = Command.Input.displayName;

export default CommandInput;
