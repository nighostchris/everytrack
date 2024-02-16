import clsx from 'clsx';
import React from 'react';
import { camelCase } from 'lodash';
import { Control, Controller, FieldValues } from 'react-hook-form';

export interface RadioGroupOption {
  value: string;
  display: string;
}

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  options: Array<RadioGroupOption>;
  control: Control<FieldValues, any>;
  error?: string;
  formId?: string;
  className?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ label, options, control, error, formId = camelCase(label), className, ...props }, ref) => {
    return (
      <div className={clsx(className, 'grid w-full max-w-sm gap-2')} {...props}>
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <Controller
          control={control}
          name={formId}
          render={({ field: { ref, value: selectedValue, onChange, ...props } }) => (
            <div className="flex flex-col rounded-md bg-white" {...props}>
              {options.map(({ display, value }, optionIndex) => (
                <div
                  role="radio"
                  aria-checked="mixed"
                  key={`radio-group-option-${optionIndex}`}
                  onClick={() => onChange(value)}
                  className={clsx(
                    {
                      'border-t-0': optionIndex !== 0,
                      'z-10 bg-indigo-50': selectedValue === value,
                      'rounded-tl-md rounded-tr-md': optionIndex === 0,
                      'rounded-bl-md rounded-br-md': optionIndex === options.length - 1,
                    },
                    'relative flex cursor-pointer border border-gray-200 p-4 focus:outline-none',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      {
                        'border-gray-300 bg-white': value !== selectedValue,
                        'border-indigo-300 bg-white': value === selectedValue,
                      },
                      'mt-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border',
                    )}
                  >
                    <span className={clsx({ 'bg-indigo-600': value === selectedValue }, 'h-2.5 w-2.5 rounded-full')} />
                  </span>
                  <label className="ml-3 text-sm font-medium text-gray-900">{display}</label>
                </div>
              ))}
            </div>
          )}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
