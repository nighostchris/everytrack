/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import { Root } from '@layouts/root';
import { store } from '@features/savings/zustand';
import { useSavingsState } from '@features/savings/hooks/use_savings_state';
import { SavingProviderTable, AddNewProviderModal, EditAccountBalanceModal } from '@features/savings/components';

import 'react-toastify/dist/ReactToastify.css';

export const SavingsPage: React.FC = () => {
  const { isLoading } = useSavingsState();
  const { bankAccounts, bankDetails, currencies, openAddNewProviderModal, openEditAccountBalanceModal, updateOpenAddNewProviderModal } =
    store();

  const generateProviderTableRows = React.useMemo(() => {
    const accountMap = new Map();
    const currenciesMap = new Map();
    const result: {
      name: string;
      icon: string;
      accounts: { id: string; type: string; balance: string; currency: { id: string; symbol: string } }[];
    }[] = [];
    if (bankDetails && bankAccounts && currencies) {
      // Generate a currency map
      currencies.forEach(({ id, symbol }) => currenciesMap.set(id, symbol));
      // Generate a bank account map
      bankAccounts.forEach(({ balance, currencyId, accountTypeId }) => {
        accountMap.set(accountTypeId, { balance, currency: { id: currencyId, symbol: currenciesMap.get(currencyId) } });
      });
      // Generate a bank detail map
      bankDetails.forEach(({ name, icon, accountTypes }) => {
        const owned: { id: string; type: string; balance: string; currency: { id: string; symbol: string } }[] = [];
        accountTypes.forEach(({ id, name }) => {
          if (accountMap.has(id)) {
            owned.push({ id, type: name, ...accountMap.get(id) });
          }
        });
        if (owned.length > 0) {
          result.push({ name, icon, accounts: owned });
        }
      });
      return result;
    }
    return result;
  }, [bankDetails, bankAccounts, currencies]);

  return (
    <Root>
      <AddNewProviderModal />
      <EditAccountBalanceModal />
      <div
        className={clsx('relative h-full px-4 py-6 sm:px-6 lg:px-8', {
          'z-0': openAddNewProviderModal || openEditAccountBalanceModal,
          'z-10': !openAddNewProviderModal && !openEditAccountBalanceModal,
        })}
      >
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Savings</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your bank accounts</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => updateOpenAddNewProviderModal(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add New Provider
            </button>
          </div>
        </div>
        {generateProviderTableRows.map(({ name, icon, accounts }) => (
          <div className="mt-8 flex flex-col">
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <SavingProviderTable name={name} icon={icon} accounts={accounts} />
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </Root>
  );
};

export default SavingsPage;
