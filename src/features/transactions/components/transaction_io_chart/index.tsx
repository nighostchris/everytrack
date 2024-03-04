import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

interface TransactionIOChartProps<T> {
  data: T[];
  indexKey: string;
}

export const TransactionIOChart: <T>(props: TransactionIOChartProps<T>) => React.ReactElement = ({ data, indexKey }) => {
  const [minValue, setMinValue] = React.useState(0);
  const [maxValue, setMaxValue] = React.useState(0);

  React.useEffect(() => {
    if (data.length > 0) {
      let localMin = 0;
      let localMax = 0;
      data.forEach((d: any) => {
        if (d.income && d.income > localMax) {
          localMax = d.income;
        }
        if (d.expense && Math.abs(d.expense) > localMin) {
          localMin = Math.abs(d.expense);
        }
      });
      setMinValue(localMin);
      setMaxValue(localMax);
    }
  }, [data]);

  return (
    <ResponsiveBar
      // @ts-ignore
      data={data}
      colors={['#97E3D5', '#F47560']}
      indexBy={indexKey}
      keys={['income', 'expense']}
      padding={0.4}
      margin={{ left: 0, bottom: 20, top: 50, right: 0 }}
      valueFormat={(v) => Math.abs(v).toString()}
      axisTop={{ tickSize: 0, tickPadding: 12 }}
      minValue={minValue === 0 && maxValue === 0 ? 'auto' : minValue > maxValue ? -minValue : -maxValue}
      maxValue={maxValue === 0 && maxValue === 0 ? 'auto' : maxValue > minValue ? maxValue : minValue}
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
          textStyle: { fontSize: '12', fill: '#97E3D5' },
        },
        {
          axis: 'y',
          value: 0,
          legend: 'Expense',
          legendPosition: 'bottom-left',
          legendOrientation: 'vertical',
          textStyle: { fontSize: '12', fill: '#F47560' },
          lineStyle: { stroke: '#6B7280', strokeWidth: 1 },
        },
      ]}
    />
  );
};

export default TransactionIOChart;
