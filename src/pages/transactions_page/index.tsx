/* eslint-disable max-len */
import { z } from 'zod';
import clsx from 'clsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
import {
  TransactionIOCard,
  TransactionsTable,
  AddNewTransactionModal,
  DeleteTransactionModal,
  MonthlyExpenseDistributionCard,
} from '@features/transactions/components';
import { Combobox, Input, Select } from '@components';
import { useTransactionsState } from '@features/transactions/hooks/use_transactions_state';

export const TransactionsPage: React.FC = () => {
  const {
    weeklyIOChartData,
    monthlyIOChartData,
    transactionsTableRows,
    monthlyExpenseDistributions,
    error: expensesStateError,
  } = useTransactionsState();

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<any>>({
    defaultValues: {
      search: undefined,
      sorting: 'date-latest-first',
    },
  });

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  return (
    <Root>
      <AddNewTransactionModal />
      <DeleteTransactionModal />
      <div className={clsx('relative flex h-full flex-col overflow-y-auto px-8 py-6')}>
        <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
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
          <div className="col-span-2 w-full space-y-2">
            {Array(30)
              .fill('Hello World')
              .map((data) => (
                <div className="w-full rounded-md bg-blue-100 py-4">{data}</div>
              ))}
          </div>
          <div className="sticky top-0 col-span-1 h-fit rounded-lg bg-white text-gray-800">
            <h2 className="border border-x-0 border-t-0 border-b-gray-200 px-6 py-4 font-medium">Advanced Search</h2>
            <div className="flex flex-col p-6">
              <Input label="Search" formId="search" register={register} className="mb-6 !max-w-none" />
              <Select
                label="Sort By"
                formId="sorting"
                placeholder=""
                control={control as Control<any, any>}
                className="mb-6 !max-w-none"
                options={[
                  { value: 'date-latest-first', display: 'Date (latest first)' },
                  { value: 'date-oldest-first', display: 'Date (oldest first)' },
                ]}
              />
              {/* <Select
                label="Accounts"
                formId="accounts"
                placeholder=""
                control={control as Control<any, any>}
                className="!max-w-none"
                options={[]}
              />
              <Select
                label="Categories"
                formId="categories"
                placeholder=""
                control={control as Control<any, any>}
                className="!max-w-none"
                options={[]}
              /> */}
              <Combobox
                label="Categories"
                values={selectedCategories}
                setValues={setSelectedCategories}
                options={[
                  { value: 'tax', display: 'Tax' },
                  { value: 'transport', display: 'Transport ' },
                ]}
              />
              {/* <p>Amount</p> */}
              {/* <p>Date Range</p> */}
            </div>
          </div>
        </div>
        {/* Construction ongoing */}
        <TransactionsTable data={transactionsTableRows} className="!mt-10" />
      </div>
      <ToastContainer />
    </Root>
  );
};

export default TransactionsPage;
