/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Content, Portal, Viewport } from '@radix-ui/react-select';

export const SelectContent = React.forwardRef<React.ElementRef<typeof Content>, React.ComponentPropsWithoutRef<typeof Content>>(
  ({ className, children, position = 'popper', ...props }, ref) => {
    return (
      <Portal>
        <Content
          ref={ref}
          {...props}
          position={position}
          className={clsx(
            className,
            'animate-in fade-in-80 relative z-50 max-h-64 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md',
          )}
        >
          <Viewport className={clsx('p-1', { 'w-full min-w-[var(--radix-select-trigger-width)]': position === 'popper' })}>
            {children}
          </Viewport>
        </Content>
      </Portal>
    );
  },
);

SelectContent.displayName = Content.displayName;

export default SelectContent;
