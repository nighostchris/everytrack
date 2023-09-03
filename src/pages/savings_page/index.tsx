/* eslint-disable max-len */
import React from 'react';

import Root from '@layouts/root';

const SavingsPage: React.FC = () => {
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
                Add New Bank
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="min-w-full">
                <tbody className="bg-white">
                  <tr>
                    <th colSpan={5} scope="colgroup" className="bg-gray-100 px-4">
                      <div className="flex flex-row justify-between">
                        <img src="/chase_bank.svg" alt="Chase Bank UK" className="h-16" />
                        <button
                          type="button"
                          className="my-4 rounded-md bg-indigo-600 px-4 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Add New Account
                        </button>
                      </div>
                    </th>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="w-1/4 whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">Current Account</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">£10</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </a>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">Savings Account</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">£10</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Root>
    </>
  );
};

export default SavingsPage;
