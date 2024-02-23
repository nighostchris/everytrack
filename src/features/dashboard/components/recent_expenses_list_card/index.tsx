import clsx from 'clsx';
import React from 'react';
import { capitalize } from 'lodash';

import Card from '@components/card';
import { useDisplayCurrency } from '@hooks';
import { RecentExpenseRecord } from '../../hooks/use_dashboard_state';
import { EXPENSE_CATEGORY_ICONS, EXPENSE_CATEGORY_ICON_COLORS } from '@consts';

interface RecentExpensesListCardProps {
  data: RecentExpenseRecord[];
  className?: string;
}

export const RecentExpensesListCard: React.FC<RecentExpensesListCardProps> = ({ data, className }) => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Card className={clsx('flex h-full w-full flex-col !bg-white p-6', className)}>
      <h4 className="text-sm font-medium text-gray-500">Expenses</h4>
      <h5 className="mb-2 mt-1 text-lg font-semibold">Recent Outflows</h5>
      <div className="flex h-full w-full flex-col">
        {data.length > 0 ? (
          data.map(({ name, category, amount }, index) => {
            const Icon = EXPENSE_CATEGORY_ICONS[category];
            const iconColor = EXPENSE_CATEGORY_ICON_COLORS[category];
            return (
              <div className={clsx('grid grid-cols-4 py-1', { 'border-t border-gray-100': index !== 0 })}>
                <div className="col-span-2 flex flex-row items-center text-sm text-gray-700">{name}</div>
                <div className="flex flex-row items-center">
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
    </Card>
  );
};

export default RecentExpensesListCard;
