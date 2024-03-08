import clsx from 'clsx';
import React from 'react';
import { Root, Value } from '@radix-ui/react-select';

import { SelectItem } from './SelectItem';
import { SelectTrigger } from './SelectTrigger';
import { SelectContent } from './SelectContent';

export interface SelectOption {
  value: string;
  display: string;
}

interface SelectProps extends React.ComponentPropsWithoutRef<typeof Root> {
  label: string;
  value: string;
  placeholder: string;
  options: SelectOption[];
  setValue: (newValue: string) => void;
  error?: string;
  className?: string;
  triggerClassName?: string;
}

export const Select = React.forwardRef<React.ElementRef<typeof Root>, SelectProps>(
  ({ label, value, setValue, placeholder, options, error, className, triggerClassName, ...props }, ref) => {
    return (
      <div className={clsx('flex w-full flex-col', className)}>
        {label && <label className="mb-2 block text-sm font-medium leading-none text-gray-700">{label}</label>}
        <Root value={value} onValueChange={setValue} {...props}>
          <SelectTrigger error={error} ref={ref} className={triggerClassName}>
            <Value placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ value, display }) => (
              <SelectItem key={`select-option-${value}`} value={value}>
                {display}
              </SelectItem>
            ))}
          </SelectContent>
        </Root>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
