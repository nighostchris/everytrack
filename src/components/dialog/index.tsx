/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

interface DialogProps {
  open: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, className, children }) => {
  return (
    <RadixDialog.Root open={open}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 animate-dialog-overlay bg-gray-700/[.7]" />
        <RadixDialog.Content
          className={clsx(
            className,
            'fixed left-2/4 top-2/4 w-full max-w-xs -translate-x-2/4 -translate-y-2/4 animate-dialog-content rounded-md bg-white focus:outline-none sm:max-w-md',
          )}
        >
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default Dialog;
