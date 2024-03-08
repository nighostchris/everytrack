import clsx from 'clsx';
import React from 'react';
import { camelCase } from 'lodash';
import { Root, Value } from '@radix-ui/react-select';
import { Control, Controller, FieldValues } from 'react-hook-form';

import { SelectOption } from '../classic';
import { SelectItem } from '../classic/SelectItem';
import { SelectTrigger } from '../classic/SelectTrigger';
import { SelectContent } from '../classic/SelectContent';

interface HookedSelectProps extends React.ComponentPropsWithoutRef<typeof Root> {
  label: string;
  placeholder: string;
  options: Array<SelectOption>;
  control: Control<FieldValues, any>;
  error?: string;
  formId?: string;
  className?: string;
  triggerClassName?: string;
}

export const HookedSelect = React.forwardRef<React.ElementRef<typeof Root>, HookedSelectProps>(
  ({ label, placeholder, options, control, error, formId = camelCase(label), className, triggerClassName }, ref) => {
    return (
      <div className={clsx(className, 'flex w-full max-w-sm flex-col')}>
        {/* dark:text-gray-200 */}
        {label && <label className="mb-2 block text-sm font-medium leading-none text-gray-700">{label}</label>}
        <Controller
          name={formId}
          control={control}
          render={({ field: { ref, value: selectedValue, onChange, ...props } }) => (
            <Root value={selectedValue} onValueChange={onChange} {...props}>
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
          )}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

HookedSelect.displayName = 'Select';

export default HookedSelect;
