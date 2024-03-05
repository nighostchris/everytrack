/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { capitalize } from 'lodash';
import { FaQuestion } from 'react-icons/fa6';

import Card from '@components/card';
import { Link } from 'react-router-dom';
import { useDisplayCurrency } from '@hooks';
import { TRANSACTION_GROUP_COLORS } from '@consts';
import { getTransactionGroupByCategory } from '@utils';
import { RecentTransactionRecord } from '../../hooks/use_dashboard_state';

interface RecentTransactionsListCardProps {
  data: RecentTransactionRecord[];
  className?: string;
}

export const RecentTransactionsListCard: React.FC<RecentTransactionsListCardProps> = ({ data, className }) => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Card className={clsx('flex h-96 flex-col !bg-white p-6', className)}>
      <h4 className="text-sm font-medium text-gray-500">Transactions</h4>
      <h5 className="mb-2 mt-1 text-lg font-semibold">Recent Records</h5>
      <div className="grid h-full w-full">
        {data.length > 0 ? (
          data.map(({ name, category, amount, income }, index) => {
            // To be fixed
            const Icon = FaQuestion;
            const iconColor = TRANSACTION_GROUP_COLORS[getTransactionGroupByCategory(category)];
            return (
              <div className={clsx('grid grid-cols-5', { 'border-t border-gray-100': index !== 0 })}>
                <div className="col-span-2 flex flex-row items-center text-sm text-gray-700">{name}</div>
                <div className="col-span-2 flex flex-row items-center">
                  <span className={clsx('flex h-8 w-8 items-center justify-center rounded-full')}>
                    <Icon className={clsx('h-5 w-5', { 'text-gray-900': !iconColor }, iconColor)} />
                  </span>
                  <p className="ml-1 text-sm text-gray-700">{capitalize(category)}</p>
                </div>
                <div
                  className={clsx('flex flex-row items-center justify-end text-sm', {
                    'text-green-700': income,
                    'text-red-700': !income,
                  })}
                >{`${income ? '+' : '-'}${symbol}${amount}`}</div>
              </div>
            );
          })
        ) : (
          <p className="text-lg leading-7 text-gray-600">Seems like you didn't have any transactions! 🤔🤔🤔</p>
        )}
      </div>
      <Link
        to="/transactions"
        key={`desktop-side-nav-${name}`}
        className="mt-4 flex flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-2 text-xs font-medium text-gray-700 hover:border-gray-500 hover:text-gray-900"
      >
        View all transaction records
      </Link>
    </Card>
  );
};

export default RecentTransactionsListCard;
