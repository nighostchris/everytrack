import clsx from 'clsx';
import React from 'react';

import Card from '@components/card';
import RecentTwoMonthsExpensesChart from '../recent_two_months_expenses_chart';
import type { RecentTwoMonthsExpenseSnapshot } from '../../hooks/use_dashboard_state';

interface ThisMonthVersusLastMonthCardProps {
  data: RecentTwoMonthsExpenseSnapshot[];
  className?: string;
}

export const ThisMonthVersusLastMonthCard: React.FC<ThisMonthVersusLastMonthCardProps> = ({ data, className }) => {
  return (
    <Card className={clsx('flex h-72 flex-col !bg-white p-6', className)}>
      <h4 className="text-sm font-medium text-gray-500">Expenses</h4>
      <h5 className="mb-2 mt-1 text-lg font-semibold">This month vs. Last month</h5>
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <div className="absolute h-full w-full">
          {data.length > 0 ? (
            <RecentTwoMonthsExpensesChart data={data} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="my-auto text-lg leading-7">Seems like you didn't spend a single buck! 💪🏻💪🏻💪🏻</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ThisMonthVersusLastMonthCard;
