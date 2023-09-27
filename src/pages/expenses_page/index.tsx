import clsx from 'clsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
// import { store as globalStore } from '@lib/zustand';
import { ExpensesTable } from '@features/expenses/components';
import { useExpensesState } from '@features/expenses/hooks/use_expenses_state';

export const ExpensesPage: React.FC = () => {
  const { isLoading, expensesTableRows } = useExpensesState();

  return (
    <Root>
      <div className={clsx('relative flex h-full flex-col overflow-y-auto px-8 py-6')}>
        <h1 className="text-xl font-semibold text-gray-900">Expenses</h1>
        <p className="mt-2 text-sm text-gray-700">Stay alert of where you spent your money</p>
        <ExpensesTable data={expensesTableRows} className="!mt-10" />
      </div>
      <ToastContainer />
    </Root>
  );
};

export default ExpensesPage;
