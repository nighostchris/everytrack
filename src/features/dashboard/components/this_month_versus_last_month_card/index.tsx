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
    <Card className="flex h-72 w-full flex-col !bg-white p-6">
      <h4 className="text-sm font-medium text-gray-500">Expense</h4>
      <h5 className="mb-2 mt-1 text-lg font-semibold">This month vs. Last month</h5>
      <RecentTwoMonthsExpensesChart data={data} />
    </Card>
  );
};

export default ThisMonthVersusLastMonthCard;
