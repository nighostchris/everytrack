/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import { Root } from '@layouts/root';
import { useTransactions } from '@hooks';
import {
  TransactionIOCard,
  TransactionsTable,
  AdvancedSearchToolbox,
  AddNewTransactionModal,
  DeleteTransactionModal,
  TransactionHistoryList,
  MonthlyExpenseDistributionCard,
} from '@features/transactions/components';
import { useTransactionsState } from '@features/transactions/hooks/use_transactions_state';

import 'react-toastify/dist/ReactToastify.css';

export const TransactionsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const {
    weeklyIOChartData,
    monthlyIOChartData,
    transactionsTableRows,
    monthlyExpenseDistributions,
    error: expensesStateError,
  } = useTransactionsState();

  return (
    <Root>
      <AddNewTransactionModal />
      <DeleteTransactionModal />
      <div className={clsx('relative flex h-full flex-col overflow-y-auto px-8 pb-6')}>
        <h1 className="mt-6 text-xl font-semibold text-gray-900">Transactions</h1>
        <p className="mt-2 text-sm text-gray-700">Easily organize and search all your income payments and expenses</p>
        <div className="mt-6 grid grid-rows-1 gap-y-6 xl:grid-cols-2 xl:gap-x-8 xl:gap-y-0">
          <div className="grid grid-cols-1 gap-y-6">
            <TransactionIOCard weeklyData={weeklyIOChartData} monthlyData={monthlyIOChartData} />
          </div>
          <div className="grid grid-cols-1 gap-y-6">
            <MonthlyExpenseDistributionCard data={monthlyExpenseDistributions} />
          </div>
        </div>
        {/* Construction ongoing */}
        <div className="relative mt-6 grid grid-cols-3 gap-x-6">
          <TransactionHistoryList transactions={transactions ?? []} />
          <AdvancedSearchToolbox />
        </div>
        {/* Construction ongoing */}
        <TransactionsTable data={transactionsTableRows} className="!mt-10" />
      </div>
      <ToastContainer />
    </Root>
  );
};

export default TransactionsPage;
