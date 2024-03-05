import clsx from 'clsx';
import React from 'react';
import { Command as BaseCommand } from 'cmdk';

import { CommandItem } from './CommandItem';
import { CommandList } from './CommandList';
import { CommandInput } from './CommandInput';
import { CommandEmpty } from './CommandEmpty';
import { CommandGroup } from './CommandGroup';
import { CommandDialog } from './CommandDialog';
import { CommandShortcut } from './CommandShortcut';
import { CommandSeparator } from './CommandSeparator';

export const Command = React.forwardRef<React.ElementRef<typeof BaseCommand>, React.ComponentPropsWithoutRef<typeof BaseCommand>>(
  ({ className, ...props }, ref) => (
    <BaseCommand ref={ref} className={clsx('flex h-full w-full flex-col overflow-hidden rounded-md', className)} {...props} />
  ),
);

Command.displayName = BaseCommand.displayName;

export { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator };

export default Command;
