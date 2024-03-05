/* eslint-disable max-len */
import React from 'react';
import { Command as BaseCommand } from 'cmdk';
import { Root, type DialogProps } from '@radix-ui/react-dialog';

import DialogContent from '../dialog/DialogContent';

interface CommandDialogProps extends DialogProps {
  open: boolean;
}

export const CommandDialog: React.FC<CommandDialogProps> = ({ children, ...props }) => {
  return (
    <Root {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <BaseCommand className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </BaseCommand>
      </DialogContent>
    </Root>
  );
};

export default CommandDialog;
