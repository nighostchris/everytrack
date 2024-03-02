import clsx from 'clsx';
import React from 'react';

import Card from '@components/card';
import MonthlyIOChart from '../monthly_io_chart';
import { MonthlyIOChartData } from '@features/transactions/hooks/use_transactions_state';

interface MonthlyIOCardProps {
  data: MonthlyIOChartData[];
  className?: string;
}

export const MonthlyIOCard: React.FC<MonthlyIOCardProps> = ({ data, className }) => {
  return (
    <Card className={clsx('flex h-72 flex-col !bg-white p-6', className)}>
      <h5 className="mb-2 text-sm font-semibold">Monthly I/O</h5>
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <div className="absolute h-full w-full">
          <MonthlyIOChart data={data} />
        </div>
      </div>
    </Card>
  );
};

export default MonthlyIOCard;
