import React from 'react';
import { Command } from 'cmdk';

export const CommandEmpty = React.forwardRef<React.ElementRef<typeof Command.Empty>, React.ComponentPropsWithoutRef<typeof Command.Empty>>(
  (props, ref) => <Command.Empty ref={ref} className="py-6 text-center text-sm" {...props} />,
);

CommandEmpty.displayName = Command.Empty.displayName;

export default CommandEmpty;
