/* eslint-disable max-len */
import React from 'react';

import Root from '@layouts/root';
import { SavingProviderTable } from '@features/savings/components/saving_provider_table';

export const SavingsPage: React.FC = () => {
  return (
    <>
      <Root>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Savings</h1>
              <p className="mt-2 text-sm text-gray-700">Balance of all your bank accounts</p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add New Provider
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <SavingProviderTable
                name="Chase Bank UK"
                icon="/chase_bank.svg"
                accounts={[
                  { type: 'Current Account', balance: '10' },
                  { type: 'Savings Account', balance: '10' },
                ]}
              />
            </div>
          </div>
        </div>
      </Root>
    </>
  );
};

export default SavingsPage;
