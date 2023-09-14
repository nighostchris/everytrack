/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { Content, Portal, Viewport } from '@radix-ui/react-select';

export const SelectContent = React.forwardRef<React.ElementRef<typeof Content>, React.ComponentPropsWithoutRef<typeof Content>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Portal>
        <Content
          ref={ref}
          {...props}
          position="popper"
          className={clsx(
            className,
            'animate-in fade-in-80 relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-100 bg-white text-slate-700 shadow-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
          )}
        >
          <Viewport className="p-1">{children}</Viewport>
        </Content>
      </Portal>
    );
  },
);

SelectContent.displayName = Content.displayName;

export default SelectContent;
