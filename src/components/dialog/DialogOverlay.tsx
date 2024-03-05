/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Overlay } from '@radix-ui/react-dialog';

export const DialogOverlay = React.forwardRef<React.ElementRef<typeof Overlay>, React.ComponentPropsWithoutRef<typeof Overlay>>(
  ({ className, ...props }, ref) => (
    <Overlay
      ref={ref}
      className={clsx(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  fixed inset-0 z-50 bg-black/80',
        className,
      )}
      {...props}
    />
  ),
);

DialogOverlay.displayName = Overlay.displayName;

export default DialogOverlay;
