import clsx from 'clsx';
import React from 'react';
import { camelCase } from 'lodash';
import { Root, Value } from '@radix-ui/react-select';
import { Control, Controller, FieldValues } from 'react-hook-form';

import { SelectItem } from './SelectItem';
import { SelectTrigger } from './SelectTrigger';
import { SelectContent } from './SelectContent';

export interface SelectOption {
  value: string;
  display: string;
}

interface SelectProps extends React.ComponentPropsWithoutRef<typeof Root> {
  label: string;
  placeholder: string;
  options: Array<SelectOption>;
  control: Control<FieldValues, any>;
  error?: string;
  formId?: string;
  className?: string;
}

export const Select = React.forwardRef<React.ElementRef<typeof Root>, SelectProps>(
  ({ label, placeholder, options, control, error, formId = camelCase(label), className }, ref) => {
    return (
      <div className={clsx(className, 'flex w-full max-w-sm flex-col')}>
        {/* dark:text-gray-200 */}
        {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
        <Controller
          name={formId}
          control={control}
          render={({ field: { ref, value: selectedValue, onChange, ...props } }) => (
            <Root value={selectedValue} onValueChange={onChange} {...props}>
              <SelectTrigger error={error} ref={ref}>
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
          )}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
