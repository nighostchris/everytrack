import React from 'react';
import dayjs from 'dayjs';
import { useDisplayCurrency } from '@hooks';
import { ResponsiveLine } from '@nivo/line';

import type { FutureTotalAssetPredictionData } from '../../hooks/use_metrics_state';

interface FutureTotalAssetPredictionChartProps {
  data: FutureTotalAssetPredictionData[];
  timeInterval?: number;
}

export const FutureTotalAssetPredictionChart: React.FC<FutureTotalAssetPredictionChartProps> = ({ data, timeInterval = 5 }) => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <ResponsiveLine
      data={data}
      colors={'#1d4ed8'}
      margin={{ left: 50, bottom: 50, top: 50, right: 0 }}
      xScale={{ type: 'time' }}
      yScale={{
        min: 0,
        max: 'auto',
        type: 'linear',
      }}
      useMesh={true}
      curve="basis"
      lineWidth={1}
      enableArea={true}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickValues: timeInterval,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -12,
        legendPosition: 'middle',
        truncateTickAt: 0,
        format: (value) => dayjs(value).format('MMM YYYY'),
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
          data: { x: date, y: value },
        },
      }) => (
        <div className="flex flex-col whitespace-pre-wrap rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-200">
          <p>{`${symbol}${value}`}</p>
          <p>{dayjs(date).format('DD MMM YYYY')}</p>
        </div>
      )}
    />
  );
};

export default FutureTotalAssetPredictionChart;
