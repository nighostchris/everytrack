/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { FaCheck } from 'react-icons/fa6';
import { Item, ItemText, ItemIndicator } from '@radix-ui/react-select';

export const SelectItem = React.forwardRef<React.ElementRef<typeof Item>, React.ComponentPropsWithoutRef<typeof Item>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Item
        ref={ref}
        {...props}
        className={clsx(
          className,
          'relative flex cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm text-gray-800 outline-none focus:bg-gray-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        )}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <ItemIndicator>
            <FaCheck className="h-4 w-4" />
          </ItemIndicator>
        </span>
        <ItemText>{children}</ItemText>
      </Item>
    );
  },
);

SelectItem.displayName = Item.displayName;

export default SelectItem;
