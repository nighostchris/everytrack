/* eslint-disable max-len */
import React from 'react';

interface Account {
  type: string;
  balance: string;
}

interface SavingProviderTableProps {
  name: string;
  icon: string;
  accounts: Account[];
}

export const SavingProviderTable: React.FC<SavingProviderTableProps> = ({ name, icon, accounts }) => {
  return (
    <table className="min-w-full">
      <tbody className="bg-white">
        <tr>
          <th colSpan={5} scope="colgroup" className="bg-gray-100 px-4">
            <div className="flex flex-row justify-between">
              <img src={icon} alt={name} className="h-16" />
              {/* TODO: Feature to be added later */}
              {/* <button
                type="button"
                className="my-4 rounded-md bg-indigo-600 px-4 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add New Account
              </button> */}
            </div>
          </th>
        </tr>
        {accounts.map(({ type, balance }) => (
          <tr className="border-t border-gray-300">
            <td className="w-1/4 whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{type}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{balance}</td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
              <a href="#" className="text-indigo-600 hover:text-indigo-900">
                Edit
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SavingProviderTable;
