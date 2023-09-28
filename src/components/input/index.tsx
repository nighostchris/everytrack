/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { camelCase } from 'lodash';
import { IconBase } from 'react-icons';
import { LuAlertCircle } from 'react-icons/lu';
import { UseFormRegister } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegister<any>;
  formId?: string;
  error?: string;
  className?: string;
  icon?: {
    element: typeof IconBase;
    orientation: 'leading' | 'trailing';
  };
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, register, formId = camelCase(label), error, className, icon, type = 'text', ...props }, ref) => {
    return (
      <div className={clsx(className, 'flex w-full max-w-sm flex-col')}>
        {label && <label className="mb-2 block text-sm font-medium leading-none text-gray-700">{label}</label>}
        <div className="relative rounded-md shadow-sm">
          {icon && icon.orientation === 'leading' && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <icon.element className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <input
            id={label}
            {...props}
            type={type}
            {...register(formId, { required: props.required })}
            className={clsx(
              {
                'border-gray-300': !error,
                '!cursor-not-allowed': props.disabled,
                'border-red-300 !pr-10 text-red-900': error,
                '!pl-10': icon && icon.orientation === 'leading',
                '!pr-10': icon && icon.orientation === 'trailing',
              },
              'h-9 w-full rounded-md px-3 py-1 shadow-sm focus:border-none focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm',
            )}
          />
          {!error && icon && icon.orientation === 'trailing' && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pl-3">
              <icon.element className="h-4 w-4 text-gray-400" />
            </div>
          )}
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

Input.displayName = 'Input';

export default Input;
