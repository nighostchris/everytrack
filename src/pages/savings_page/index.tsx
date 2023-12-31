/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { FaSackDollar } from 'react-icons/fa6';
import { ToastContainer } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

import { Root } from '@layouts/root';
import {
  AddNewAccountModal,
  DeleteAccountModal,
  AddNewProviderModal,
  SavingProviderTable,
  EditAccountBalanceModal,
} from '@features/savings/components';
import { StatCard } from '@components';
import { store } from '@features/savings/zustand';
import { useSavingsState } from '@features/savings/hooks/use_savings_state';

import 'react-toastify/dist/ReactToastify.css';

export const SavingsPage: React.FC = () => {
  const {
    openAddNewAccountModal,
    openDeleteAccountModal,
    openAddNewProviderModal,
    openEditAccountBalanceModal,
    updateOpenAddNewProviderModal,
  } = store();
  const { displayCurrency } = useOutletContext<{ displayCurrency: string }>();
  const { isLoading, totalBalance, canAddNewProvider, savingProviderTableRows } = useSavingsState();

  return (
    <Root>
      <AddNewAccountModal />
      <DeleteAccountModal />
      <AddNewProviderModal />
      <EditAccountBalanceModal />
      <div
        className={clsx('relative h-full overflow-y-auto px-8 py-6', {
          'z-0': openAddNewProviderModal || openDeleteAccountModal || openEditAccountBalanceModal || openAddNewAccountModal,
          'z-10': !openAddNewProviderModal && !openDeleteAccountModal && !openEditAccountBalanceModal && !openAddNewAccountModal,
        })}
      >
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Savings</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your bank accounts</p>
          </div>
          {canAddNewProvider && (
            <button
              type="button"
              onClick={() => updateOpenAddNewProviderModal(true)}
              className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
            >
              Add New Provider
            </button>
          )}
        </div>
        <StatCard title="Total Balance" icon={FaSackDollar} className="mt-6 sm:max-w-xs">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${displayCurrency} ${totalBalance}`}</p>
        </StatCard>
        {savingProviderTableRows.map((row) => (
          <div key={`provider-table-${row.id}`} className="mt-8 flex flex-col">
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <SavingProviderTable data={row} />
            </div>
          </div>
        ))}
        {savingProviderTableRows.length === 0 && (
          <div className="flex w-full flex-col items-center py-6">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Oops! 😢</h1>
            <p className="mt-6 text-lg leading-7 text-gray-600">Your pocket seems to be empty 💸💸💸</p>
            <p className="mt-2 text-base leading-7 text-gray-600">Just click the button in top right corner to add your bank accounts!</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </Root>
  );
};

export default SavingsPage;
