import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';

import { Button } from '@components';
import { Transaction } from '@api/everytrack_backend';

interface TransactionHistoryListProps {
  transactions: Transaction[];
  className?: string;
}

export const TransactionHistoryList: React.FC<TransactionHistoryListProps> = ({ transactions, className }) => {
  const displayTransactions = React.useMemo(() => {
    if (transactions) {
      return Array.from(
        transactions.reduce<Map<number, any>>((acc, { name, amount, currencyId, category, income, remarks, executedAt }) => {
          const existingData = acc.get(executedAt);
          const newRecord = { name, amount, currencyId, category, income, remarks };
          if (existingData) {
            acc.set(executedAt, { records: [...existingData.records, newRecord] });
          } else {
            acc.set(executedAt, { records: [newRecord] });
          }
          return acc;
        }, new Map()),
        ([executedAt, { records }]) => ({ date: executedAt, records: records }),
      ).sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return [];
  }, [transactions]);

  return (
    <div className="relative col-span-2 w-full rounded-lg">
      <div className="sticky top-0 z-20 flex w-full flex-row items-center justify-between bg-white px-6 py-4">
        <h2 className="font-medium text-gray-900">History</h2>
        <Button variant="contained" className="h-6 !bg-slate-100 text-xs !text-gray-700 hover:!bg-slate-200" onClick={() => {}}>
          Add New Transaction
        </Button>
      </div>
      {displayTransactions.map(({ date, records }) => (
        <div className="relative grid w-full grid-rows-1">
          <div className="sticky top-14 z-10 w-full bg-gray-200 px-6 py-2">
            <h3 className="text-xs font-medium text-gray-500">{dayjs.unix(Number(date)).format('MMM DD, YYYY')}</h3>
          </div>
          {records.map(({ name, amount, category, income }: any, recordIndex: number) => (
            <div className={clsx('grid grid-cols-5 bg-white px-6 py-4', { 'border-t border-gray-100': recordIndex !== 0 })}>
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
