import { z } from 'zod';
import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, HookedSelect } from '@components';
import { MonthlyExpenseDistributionChart } from '../monthly_expense_distribution_chart';
import { MonthlyExpenseDistribution, MonthlyExpenseDistributionData } from '../../hooks/use_transactions_state';

interface MonthlyExpenseDistributionCardProps {
  data: MonthlyExpenseDistribution[];
  className?: string;
}

const distributionChartSelectSchema = z.object({
  selectedMonth: z.string(),
});

export const MonthlyExpenseDistributionCard: React.FC<MonthlyExpenseDistributionCardProps> = ({ data, className }) => {
  const [monthlyExpenseDistributionMap, setMonthlyExpenseDistributionMap] = React.useState<Map<string, MonthlyExpenseDistributionData[]>>(
    new Map(),
  );

  const { watch, control } = useForm<z.infer<typeof distributionChartSelectSchema>>({
    defaultValues: {
      selectedMonth: dayjs().startOf('month').unix().toString(),
    },
    resolver: zodResolver(distributionChartSelectSchema),
  });
  const watchSelectedMonth = watch('selectedMonth');

  const monthlyDistributionOptions: { value: string; display: string }[] = React.useMemo(
    () =>
      Array(6)
        .fill(true)
        .reduce<number[]>(
          (acc, _, index) =>
            index === 0
              ? [dayjs().startOf('month').unix()]
              : [
                  ...acc,
                  dayjs
                    .unix(Number(acc[index - 1]))
                    .subtract(1, 'month')
                    .startOf('month')
                    .unix(),
                ],
          [],
        )
        .map((monthInUnix) => ({ value: monthInUnix.toString(), display: dayjs.unix(monthInUnix).format('MMM YY') })),
    [],
  );
  const selectedMonthlyDistribution = React.useMemo(() => {
    const data = monthlyExpenseDistributionMap.get(watchSelectedMonth);
    if (data) {
      return data.sort((a, b) => (a.percentage > b.percentage ? 1 : -1));
    }
    return [];
  }, [watchSelectedMonth, monthlyExpenseDistributionMap]);

  React.useEffect(() => {
    const map = new Map();
    data.forEach(({ month, data }) => map.set(month.toString(), data));
    setMonthlyExpenseDistributionMap(map);
  }, [data]);

  return (
    <Card className={clsx('flex h-72 flex-col space-y-2 !bg-white p-6', className)}>
      <div className="flex flex-row items-center justify-between">
        <h5 className="text-sm font-semibold">{`${dayjs.unix(Number(watchSelectedMonth)).format('MMM YY')} Expense Distribution`}</h5>
        <HookedSelect
          label=""
          placeholder=""
          formId="selectedMonth"
          control={control as Control<any, any>}
          options={monthlyDistributionOptions}
          className="!max-w-28"
          triggerClassName="!py-1 !text-xs !min-h-0"
        />
      </div>
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        {selectedMonthlyDistribution.length > 0 ? (
          <MonthlyExpenseDistributionChart data={selectedMonthlyDistribution} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <p className="my-auto text-lg leading-7">Seems like you didn't spend a single buck! 💪🏻💪🏻💪🏻</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MonthlyExpenseDistributionCard;
