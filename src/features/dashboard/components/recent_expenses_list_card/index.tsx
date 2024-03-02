/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { capitalize } from 'lodash';

import Card from '@components/card';
import { Link } from 'react-router-dom';
import { useDisplayCurrency } from '@hooks';
import { RecentExpenseRecord } from '../../hooks/use_dashboard_state';
import { TRANSACTION_CATEGORY_ICONS, TRANSACTION_CATEGORY_ICON_COLORS } from '@consts';

interface RecentExpensesListCardProps {
  data: RecentExpenseRecord[];
  className?: string;
}

export const RecentExpensesListCard: React.FC<RecentExpensesListCardProps> = ({ data, className }) => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Card className={clsx('flex h-96 flex-col !bg-white p-6', className)}>
      <h4 className="text-sm font-medium text-gray-500">Expenses</h4>
      <h5 className="mb-2 mt-1 text-lg font-semibold">Recent Outflows</h5>
      <div className="grid h-full w-full">
        {data.length > 0 ? (
          data.map(({ name, category, amount }, index) => {
            const Icon = TRANSACTION_CATEGORY_ICONS[category];
            const iconColor = TRANSACTION_CATEGORY_ICON_COLORS[category];
            return (
              <div className={clsx('grid grid-cols-5', { 'border-t border-gray-100': index !== 0 })}>
                <div className="col-span-2 flex flex-row items-center text-sm text-gray-700">{name}</div>
                <div className="col-span-2 flex flex-row items-center">
                  <span className={clsx('flex h-8 w-8 items-center justify-center rounded-full')}>
                    <Icon className={clsx('h-5 w-5', { 'text-gray-900': !iconColor }, iconColor)} />
                  </span>
                  <p className="ml-1 text-sm text-gray-700">{capitalize(category)}</p>
                </div>
                <div className="flex flex-row items-center justify-end text-sm text-gray-700">{`${symbol} ${amount}`}</div>
              </div>
            );
          })
        ) : (
          <p className="text-lg leading-7 text-gray-600">Seems like you didn't spend any money! 💪🏻💪🏻💪🏻</p>
        )}
      </div>
      <Link
        to="/expenses"
        key={`desktop-side-nav-${name}`}
        className="mt-4 flex flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-2 text-xs font-medium text-gray-700 hover:border-gray-500 hover:text-gray-900"
      >
        View all expense records
      </Link>
    </Card>
  );
};

export default RecentExpensesListCard;
