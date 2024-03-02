import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { MonthlyIOChartData } from '@features/transactions/hooks/use_transactions_state';

interface MonthlyIOChartProps {
  data: MonthlyIOChartData[];
}

export const MonthlyIOChart: React.FC<MonthlyIOChartProps> = ({ data }) => {
  return (
    <ResponsiveBar
      // @ts-ignore
      data={data}
      colors={['#97E3D5', '#F47560']}
      indexBy="month"
      keys={['income', 'expense']}
      padding={0.4}
      margin={{ left: 0, bottom: 20, top: 50, right: 0 }}
      valueFormat={(v) => Math.abs(v).toString()}
      axisTop={{ tickSize: 0, tickPadding: 12 }}
      axisLeft={null}
      axisBottom={null}
      enableGridX={true}
      enableGridY={false}
      markers={[
        {
          axis: 'y',
          value: 0,
          legend: 'Income',
          legendPosition: 'top-left',
          legendOrientation: 'vertical',
          lineStyle: { strokeOpacity: 0 },
          textStyle: { fontSize: '14', fill: '#97E3D5' },
        },
        {
          axis: 'y',
          value: 0,
          legend: 'Expense',
          legendPosition: 'bottom-left',
          legendOrientation: 'vertical',
          textStyle: { fontSize: '14', fill: '#F47560' },
          lineStyle: { stroke: '#6B7280', strokeWidth: 1 },
        },
      ]}
    />
  );
};

export default MonthlyIOChart;
