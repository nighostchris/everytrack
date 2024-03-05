import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@components';
import { store } from '@features/transactions/zustand';
import type { TransactionHistoryDailyData } from '@features/transactions/hooks/use_transactions_state';

interface TransactionHistoryListProps {
  transactionHistory: TransactionHistoryDailyData[];
  className?: string;
}

export const TransactionHistoryList: React.FC<TransactionHistoryListProps> = ({ transactionHistory, className }) => {
  const { openAddNewTransactionModal, updateOpenAddNewTransactionModal } = store(
    useShallow(({ openAddNewTransactionModal, updateOpenAddNewTransactionModal }) => ({
      openAddNewTransactionModal,
      updateOpenAddNewTransactionModal,
    })),
  );

  console.log({ updateOpenAddNewTransactionModal });

  return (
    <div className={clsx('relative col-span-2 w-full rounded-lg', className)}>
      <div
        className={clsx('sticky top-0 flex w-full flex-row items-center justify-between bg-white px-6 py-4', {
          'z-20': !openAddNewTransactionModal,
        })}
      >
        <h2 className="font-medium text-gray-900">History</h2>
        <Button
          variant="contained"
          className="h-6 !bg-slate-100 text-xs !text-gray-700 hover:!bg-slate-200"
          onClick={() => {
            updateOpenAddNewTransactionModal(true);
          }}
        >
          Add New Transaction
        </Button>
      </div>
      {transactionHistory.map(({ date, records }) => (
        <div className="relative grid w-full grid-rows-1">
          <div
            className={clsx('sticky top-14 w-full bg-gray-200 px-6 py-2', {
              'z-10': !openAddNewTransactionModal,
              '-z-10': openAddNewTransactionModal,
            })}
          >
            <h3 className="text-xs font-medium text-gray-500">{dayjs.unix(Number(date)).format('MMM DD, YYYY')}</h3>
          </div>
          {records.map(({ name, amount, category, income }: any, recordIndex: number) => (
            <div
              className={clsx('grid grid-cols-5 bg-white px-6 py-4', {
                '-z-20': openAddNewTransactionModal,
                'border-t border-gray-100': recordIndex !== 0,
              })}
            >
              <div className="col-span-2 flex flex-row items-center text-sm text-gray-700">{name}</div>
              <div className="col-span-2 flex flex-row items-center">
                {/* <span className={clsx('flex h-8 w-8 items-center justify-center rounded-full')}>
                    <Icon className={clsx('h-5 w-5', { 'text-gray-900': !iconColor }, iconColor)} />
                  </span> */}
                <p className="ml-1 text-sm text-gray-700">{category}</p>
              </div>
              <div
                className={clsx('flex flex-row items-center justify-end text-sm', {
                  'text-green-700': income,
                  'text-red-700': !income,
                })}
              >{`${income ? '+' : '-'}$${amount}`}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TransactionHistoryList;
