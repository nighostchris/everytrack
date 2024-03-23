/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { camelCase } from 'lodash';
import { LuAlertCircle } from 'react-icons/lu';
import { UseFormRegister } from 'react-hook-form';

interface HookedInputWithAddOnProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegister<any>;
  formId?: string;
  error?: string;
  addOn?: string;
  className?: string;
}

export const HookedInputWithAddOn = React.forwardRef<HTMLInputElement, HookedInputWithAddOnProps>(
  ({ label, register, formId = camelCase(label), error, addOn, className, type = 'text', ...props }, ref) => {
    return (
      <div className={clsx(className, 'flex w-full max-w-sm flex-col')} ref={ref}>
        {label && <label className="mb-2 block text-sm font-medium leading-none text-gray-700">{label}</label>}
        <div className="flex rounded-md">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 md:text-sm">
            {addOn}
          </span>
          <input
            id={label}
            {...props}
            type={type}
            {...register(formId, { required: props.required })}
            className={clsx(
              {
                'border-gray-300 ': !error,
                '!cursor-not-allowed': props.disabled,
                'border-red-300 !pr-10 text-red-900': error,
              },
              'h-9 w-full rounded-r-md px-3 py-1 text-sm focus:border-gray-300 focus:outline-none focus:ring-0',
            )}
          />
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <LuAlertCircle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

HookedInputWithAddOn.displayName = 'HookedInputWithAddOn';

export default HookedInputWithAddOn;
