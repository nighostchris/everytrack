/* eslint-disable max-len */
import React from 'react';
import BigNumber from 'bignumber.js';

import { store } from '@features/savings/zustand';
import { SavingProviderTableAccount } from '../../hooks/use_savings_state';

interface SavingProviderTableProps {
  name: string;
  icon: string;
  accounts: SavingProviderTableAccount[];
}

export const SavingProviderTable: React.FC<SavingProviderTableProps> = ({ name, icon, accounts }) => {
  const {
    updateBalance,
    updateAccountId,
    updateCurrencyId,
    updateProviderName,
    updateAccountTypeId,
    updateOpenDeleteAccountModal,
    updateOpenAddNewAccountModal,
    updateOpenEditAccountBalanceModal,
  } = store();

  return (
    <table className="min-w-full">
      <tbody className="bg-white">
        <tr>
          <th colSpan={5} scope="colgroup" className="bg-gray-100 px-4">
            <div className="flex flex-row items-center justify-between">
              <img src={icon} alt={name} className="h-16 w-24 object-scale-down" />
              <a
                onClick={(e) => {
                  e.preventDefault();
                  updateProviderName(name);
                  updateOpenAddNewAccountModal(true);
                }}
                className="text-sm font-medium text-indigo-600 hover:cursor-pointer hover:text-indigo-900"
              >
                Add New Account
              </a>
            </div>
          </th>
        </tr>
        {accounts.map(({ id, type, balance, accountTypeId, currency: { id: currencyId, symbol } }) => (
          <tr key={id} className="border-t border-gray-300">
            <td className="w-1/4 whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{type}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`${symbol} ${new BigNumber(balance).toFormat(2)}`}</td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
              <div className="flex flex-row justify-end">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    updateBalance(balance);
                    updateCurrencyId(currencyId);
                    updateAccountTypeId(accountTypeId);
                    updateOpenEditAccountBalanceModal(true);
                  }}
                  className="text-indigo-600 hover:cursor-pointer hover:text-indigo-900"
                >
                  Edit
                </a>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    updateAccountId(id);
                    updateOpenDeleteAccountModal(true);
                  }}
                  className="ml-4 text-indigo-600 hover:cursor-pointer hover:text-indigo-900"
                >
                  Delete
                </a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SavingProviderTable;
