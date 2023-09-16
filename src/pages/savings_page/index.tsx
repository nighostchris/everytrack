/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

import { Root } from '@layouts/root';
import { store } from '@features/savings/zustand';
import { useSavingsState } from '@features/savings/hooks/use_savings_state';
import { SavingProviderTable, AddNewProviderModal, EditAccountBalanceModal, AddNewAccountModal } from '@features/savings/components';

import 'react-toastify/dist/ReactToastify.css';

export const SavingsPage: React.FC = () => {
  const { displayCurrency } = useOutletContext<{ displayCurrency: string }>();
  const { isLoading, totalBalance, savingProviderTableRows } = useSavingsState();
  const { openAddNewAccountModal, openAddNewProviderModal, openEditAccountBalanceModal, updateOpenAddNewProviderModal } = store();

  return (
    <Root>
      <AddNewAccountModal />
      <AddNewProviderModal />
      <EditAccountBalanceModal />
      <div
        className={clsx('relative h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8', {
          'z-0': openAddNewProviderModal || openEditAccountBalanceModal || openAddNewAccountModal,
          'z-10': !openAddNewProviderModal && !openEditAccountBalanceModal && !openAddNewAccountModal,
        })}
      >
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Savings</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your bank accounts</p>
          </div>
          <button
            type="button"
            onClick={() => updateOpenAddNewProviderModal(true)}
            className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
          >
            Add New Provider
          </button>
        </div>
        <div className="mt-6 rounded-lg border border-gray-300 px-6 py-4 sm:max-w-xs">
          <h3 className="font-semibold">Total</h3>
          <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-2xl">{`${displayCurrency} ${totalBalance}`}</p>
        </div>
        {savingProviderTableRows.map(({ name, icon, accounts }) => (
          <div key={`provider-table-${name.toLowerCase().replaceAll(/\\s|(|)/g, '-')}`} className="mt-8 flex flex-col">
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
