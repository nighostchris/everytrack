/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
import { StatCard, Tabs, TabsContent, TabsList, TabsTrigger } from '@components';
import { useTransactionsState } from '@features/transactions/hooks/use_transactions_state';
import { MonthlyIOCard, AddNewTransactionModal, DeleteTransactionModal, TransactionsTable } from '@features/transactions/components';

export const TransactionsPage: React.FC = () => {
  const { monthlyIOChartData, transactionsTableRows, error: expensesStateError } = useTransactionsState();

  return (
    <Root>
      <AddNewTransactionModal />
      <DeleteTransactionModal />
      <div className={clsx('relative flex h-full flex-col overflow-y-auto px-8 py-6')}>
        <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
        <p className="mt-2 text-sm text-gray-700">Easily organize and search all your income payments and expenses</p>
        <div className="mt-6 grid grid-rows-1 gap-y-6 xl:grid-cols-2 xl:gap-x-8 xl:gap-y-0">
          <div className="grid grid-cols-1 gap-y-6">
            <MonthlyIOCard data={monthlyIOChartData} />
          </div>
          <div className="grid grid-cols-1 gap-y-6"></div>
        </div>
        <TransactionsTable data={transactionsTableRows} className="!mt-10" />
      </div>
      <ToastContainer />
    </Root>
  );
};

export default TransactionsPage;
