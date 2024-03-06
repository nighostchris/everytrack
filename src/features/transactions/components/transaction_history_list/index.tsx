import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { capitalize } from 'lodash';
import { useShallow } from 'zustand/react/shallow';
import { IoIosRemoveCircle } from 'react-icons/io';

import { Button } from '@components';
import { TRANSACTION_CATEGORY_ICONS } from '@consts';
import { store } from '@features/transactions/zustand';
import type { TransactionHistoryDailyData } from '@features/transactions/hooks/use_transactions_state';

interface TransactionHistoryListProps {
  transactionHistory: TransactionHistoryDailyData[];
  className?: string;
}

export const TransactionHistoryList: React.FC<TransactionHistoryListProps> = ({ transactionHistory, className }) => {
  const {
    openAddNewTransactionModal,
    openDeleteTransactionModal,
    updateOpenDeleteTransactionModal,
    updateOpenAddNewTransactionModal,
    populateDeleteTransactionModalState,
  } = store(
    useShallow(
      ({
        openAddNewTransactionModal,
        openDeleteTransactionModal,
        updateOpenDeleteTransactionModal,
        updateOpenAddNewTransactionModal,
        populateDeleteTransactionModalState,
      }) => ({
        openAddNewTransactionModal,
        openDeleteTransactionModal,
        updateOpenDeleteTransactionModal,
        updateOpenAddNewTransactionModal,
        populateDeleteTransactionModalState,
      }),
    ),
  );

  return (
    <div className={clsx('relative col-span-2 h-fit w-full rounded-lg shadow-lg', className)}>
      <div
        className={clsx('sticky top-0 flex w-full flex-row items-center justify-between rounded-t-lg bg-white px-6 py-4', {
          'z-20': !openAddNewTransactionModal && !openDeleteTransactionModal,
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
      {transactionHistory.map(({ date, records }, historyIndex) => (
        <div className="relative grid w-full grid-rows-1">
          <div
            className={clsx('sticky top-14 w-full bg-gray-200 px-6 py-2', {
              'z-10': !openAddNewTransactionModal || !openDeleteTransactionModal,
              '-z-10': openAddNewTransactionModal || openDeleteTransactionModal,
            })}
          >
            <h3 className="text-xs font-medium text-gray-500">{dayjs.unix(Number(date)).format('MMM DD, YYYY')}</h3>
          </div>
          {records.map(({ id: transactionId, name, amount, symbol, category, income }, recordIndex: number) => (
            <div
              className={clsx('grid grid-cols-5 bg-white px-6 py-4', {
                '-z-20': openAddNewTransactionModal || openDeleteTransactionModal,
                'border-t border-gray-100': recordIndex !== 0,
                'rounded-b-lg': historyIndex === transactionHistory.length - 1 && recordIndex === records.length - 1,
              })}
            >
              <div className="col-span-2 flex flex-row items-center text-sm text-gray-700">{name}</div>
              <div className="col-span-2 flex flex-row items-center">
                <p className="text-xl">{TRANSACTION_CATEGORY_ICONS[category]}</p>
                <p className="ml-2 text-sm text-gray-700">
                  {category
                    .split('-')
                    .map((v) => capitalize(v))
                    .join(' ')}
                </p>
              </div>
              <div className={clsx('flex flex-row items-center justify-end', {})}>
                <p
                  className={clsx('mr-3 text-sm', {
                    'text-green-700': income,
                    'text-red-700': !income,
                  })}
                >{`${income ? '+' : '-'}${symbol}${amount}`}</p>
                <IoIosRemoveCircle
                  className="h-5 w-5 text-gray-600 hover:cursor-pointer"
                  onClick={() => {
                    populateDeleteTransactionModalState({ income, transactionId });
                    updateOpenDeleteTransactionModal(true);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
      {transactionHistory.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center rounded-b-lg bg-white px-6 py-12">
          <p className="text-sm leading-7 text-gray-600">Seems like you didn't have any transactions! 🤔🤔🤔</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryList;
