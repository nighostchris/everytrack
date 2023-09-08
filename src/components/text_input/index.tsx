/* eslint-disable max-len */
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface TextInputProps {
  label: string;
  displayLabel: string;
  type: 'text' | 'email' | 'password';
  register: UseFormRegister<any>;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ type, label, register, displayLabel, error }) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{displayLabel}</label>
      <div className="mt-1">
        <input
          {...register(label)}
          id={label}
          type={type}
          name={label}
          autoComplete={type !== 'password' ? label : undefined}
          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {typeof error !== 'undefined' ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}
    </div>
  );
};

export default TextInput;
