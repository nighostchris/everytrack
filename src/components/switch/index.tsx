/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { camelCase } from 'lodash';
import { Root, Thumb } from '@radix-ui/react-switch';
import { Control, Controller, FieldValues } from 'react-hook-form';

interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  control: Control<FieldValues, any>;
  error?: string;
  formId?: string;
  className?: string;
}

export const Switch = React.forwardRef<React.ElementRef<typeof Root>, React.ComponentPropsWithoutRef<typeof Root> & SwitchProps>(
  ({ label, error, control, formId = camelCase(label), className, ...props }, ref) => (
    <div className={clsx(className, 'grid w-full max-w-sm gap-2')} {...props}>
      {label && <label className="block text-sm font-medium leading-none text-gray-700">{label}</label>}
      <Controller
        control={control}
        name={formId}
        render={({ field: { ref, value: selectedValue, onChange, ...props } }) => (
          <Root
            className={clsx(
              'peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300',
              className,
            )}
            checked={selectedValue}
            onClick={() => onChange(!selectedValue)}
            {...props}
            ref={ref}
          >
            <Thumb
              className={clsx(
                'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
              )}
            />
          </Root>
        )}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  ),
);

Switch.displayName = Root.displayName;

export default Switch;
