import React from 'react';
import { useDisplayCurrency } from '@hooks';
import { ResponsiveLine } from '@nivo/line';

import type { RecentTwoMonthsExpenseSnapshot } from '../../hooks/use_dashboard_state';

interface RecentTwoMonthsExpensesChartProps {
  data: RecentTwoMonthsExpenseSnapshot[];
}

export const RecentTwoMonthsExpensesChart: React.FC<RecentTwoMonthsExpensesChartProps> = ({ data }) => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <ResponsiveLine
      data={data}
      colors={['#f87171', '#60a5fa']}
      margin={{ left: 50, bottom: 50, top: 50, right: 50 }}
      xScale={{ type: 'linear' }}
      yScale={{
        min: 0,
        max: 'auto',
        type: 'linear',
      }}
      useMesh={true}
      curve="linear"
      lineWidth={1}
      enableArea={true}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickValues: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -12,
        legendPosition: 'middle',
        truncateTickAt: 0,
        format: (value) => {
          return `Day ${value}`;
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickValues: 4,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 12,
        truncateTickAt: 0,
        legendPosition: 'middle',
      }}
      enablePoints={false}
      areaOpacity={0.25}
      enableGridX={false}
      enableGridY={false}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: '#64748b',
              strokeWidth: 2,
            },
          },
        },
      }}
      tooltip={({
        point: {
          data: { y: value },
        },
      }) => (
        <div>
          <p className="whitespace-pre-wrap rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-200">{`${symbol} ${value}`}</p>
        </div>
      )}
      legends={[
        {
          itemHeight: 20,
          itemWidth: 100,
          translateY: 50,
          itemsSpacing: 20,
          direction: 'row',
          anchor: 'bottom',
        },
      ]}
    />
  );
};

export default RecentTwoMonthsExpensesChart;
