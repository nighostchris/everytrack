/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { FaSackDollar } from 'react-icons/fa6';
import { ToastContainer } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { Root } from '@layouts/root';
import {
  CashTable,
  AddNewCashModal,
  DeleteCashModal,
  AddNewAccountModal,
  DeleteAccountModal,
  AddNewProviderModal,
  SavingProviderTable,
  EditCashBalanceModal,
  EditAccountBalanceModal,
} from '@features/savings/components';
import { useDisplayCurrency } from '@hooks';
import { Button, StatCard } from '@components';
import { store as savingsStore } from '@features/savings/zustand';
import { store as accountsStore } from '@features/accounts/zustand';
import { useSavingsState } from '@features/savings/hooks/use_savings_state';
import { TransferBetweenAccountsModal } from '@features/accounts/components';

import 'react-toastify/dist/ReactToastify.css';

export const SavingsPage: React.FC = () => {
  const {
    openEditCashModal,
    openAddNewCashModal,
    openDeleteCashModal,
    openAddNewAccountModal,
    openDeleteAccountModal,
    openAddNewProviderModal,
    openEditAccountBalanceModal,
    updateOpenAddNewProviderModal,
  } = savingsStore(
    useShallow(
      ({
        openEditCashModal,
        openAddNewCashModal,
        openDeleteCashModal,
        openAddNewAccountModal,
        openDeleteAccountModal,
        openAddNewProviderModal,
        openEditAccountBalanceModal,
        updateOpenAddNewProviderModal,
      }) => ({
        openEditCashModal,
        openAddNewCashModal,
        openDeleteCashModal,
        openAddNewAccountModal,
        openDeleteAccountModal,
        openAddNewProviderModal,
        openEditAccountBalanceModal,
        updateOpenAddNewProviderModal,
      }),
    ),
  );
  const { openTransferBetweenAccountModal, updateOpenTransferBetweenAccountModal } = accountsStore(
    useShallow(({ openTransferBetweenAccountModal, updateOpenTransferBetweenAccountModal }) => ({
      openTransferBetweenAccountModal,
      updateOpenTransferBetweenAccountModal,
    })),
  );
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const { error: savingsStateError, totalBalance, enableAddNewProvider, savingProviderTableRows, cashTableRecords } = useSavingsState();

  return (
    <Root>
      <AddNewCashModal />
      <DeleteCashModal />
      <AddNewAccountModal />
      <DeleteAccountModal />
      <AddNewProviderModal />
      <EditCashBalanceModal />
      <EditAccountBalanceModal />
      <TransferBetweenAccountsModal />
      <div
        className={clsx('relative h-full overflow-y-auto px-6 py-6 md:px-8', {
          'z-0':
            openEditCashModal ||
            openAddNewCashModal ||
            openAddNewProviderModal ||
            openDeleteAccountModal ||
            openEditAccountBalanceModal ||
            openAddNewAccountModal ||
            openDeleteCashModal ||
            openTransferBetweenAccountModal,
          'z-10':
            !openEditCashModal &&
            !openDeleteCashModal &&
            !openAddNewCashModal &&
            !openAddNewProviderModal &&
            !openDeleteAccountModal &&
            !openEditAccountBalanceModal &&
            !openAddNewAccountModal &&
            !openTransferBetweenAccountModal,
        })}
      >
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Savings</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your bank accounts and cash holdings</p>
          </div>
          {enableAddNewProvider && (
            <button
              type="button"
              onClick={() => updateOpenAddNewProviderModal(true)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto md:w-auto"
            >
              Add New Provider
            </button>
          )}
        </div>
        <StatCard title="Total Balance" icon={FaSackDollar} className="mt-6 sm:max-w-xs">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${symbol} ${totalBalance}`}</p>
        </StatCard>
        <SavingProviderTable data={savingProviderTableRows} />
        <Button variant="outlined" className="my-4 w-full text-xs" onClick={() => updateOpenTransferBetweenAccountModal(true)}>
          Transfer Between Accounts
        </Button>
        <CashTable data={cashTableRecords} />
        {cashTableRecords.length === 0 && savingProviderTableRows.length === 0 && (
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
