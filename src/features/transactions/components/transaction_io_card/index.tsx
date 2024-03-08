import { z } from 'zod';
import clsx from 'clsx';
import React from 'react';
import { capitalize } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, HookedSelect } from '@components';
import { Control, useForm } from 'react-hook-form';
import { TransactionIOChart } from '../transaction_io_chart';
import { MonthlyIOChartData, WeeklyIOChartData } from '@features/transactions/hooks/use_transactions_state';

interface TransactionIOCardProps {
  weeklyData: WeeklyIOChartData[];
  monthlyData: MonthlyIOChartData[];
  className?: string;
}

const ioChartSelectSchema = z.object({
  ioChartOption: z.union([z.literal('weekly'), z.literal('monthly')]),
});

export const TransactionIOCard: React.FC<TransactionIOCardProps> = ({ weeklyData, monthlyData, className }) => {
  const { watch, control } = useForm<z.infer<typeof ioChartSelectSchema>>({
    defaultValues: {
      ioChartOption: 'monthly',
    },
    resolver: zodResolver(ioChartSelectSchema),
  });
  const watchIOChartOption = watch('ioChartOption');

  return (
    <Card className={clsx('flex h-72 flex-col space-y-2 !bg-white p-6', className)}>
      <div className="flex flex-row items-center justify-between">
        <h5 className="text-sm font-semibold">{`${capitalize(watchIOChartOption)} I/O`}</h5>
        <HookedSelect
          label=""
          placeholder=""
          formId="ioChartOption"
          control={control as Control<any, any>}
          options={[
            { value: 'weekly', display: 'Weekly I/O' },
            { value: 'monthly', display: 'Monthly I/O' },
          ]}
          className="!max-w-36"
          triggerClassName="!py-1 !text-xs !min-h-0"
        />
      </div>
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <div className="absolute h-full w-full">
          {((watchIOChartOption === 'weekly' && weeklyData.length === 0) ||
            (watchIOChartOption === 'monthly' && monthlyData.length === 0)) && (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-sm leading-7 text-gray-600">No transactions for analysis! 🤔🤔🤔</p>
            </div>
          )}
          {watchIOChartOption === 'weekly' && weeklyData.length > 0 && (
            <TransactionIOChart<WeeklyIOChartData> data={weeklyData} indexKey="week" />
          )}
          {watchIOChartOption === 'monthly' && monthlyData.length > 0 && (
            <TransactionIOChart<MonthlyIOChartData> data={monthlyData} indexKey="month" />
          )}
        </div>
      </div>
    </Card>
  );
};

export default TransactionIOCard;
