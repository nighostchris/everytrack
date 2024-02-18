import dayjs from 'dayjs';
import React from 'react';
import { ResponsiveLine } from '@nivo/line';

import { useDisplayCurrency } from '@hooks';
import { TotalAssetValueSnapshot } from '../../hooks/use_metrics_state';

interface FutureTotalAssetPredictionGraphProps {
  min: string;
  max: string;
  data: TotalAssetValueSnapshot[];
}

export const FutureTotalAssetPredictionGraph: React.FC<FutureTotalAssetPredictionGraphProps> = ({ min, max, data }) => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  return (
    <div className="h-[400px] w-full p-6 pt-0">
      <ResponsiveLine
        data={[{ id: 'totalAssetSnapshots', data }]}
        margin={{ left: 40, bottom: 20, top: 50, right: 40 }}
        xScale={{ type: 'point' }}
        yScale={{
          min: Number(min),
          max: Number(max),
          stacked: true,
          reverse: false,
          type: 'linear',
        }}
        useMesh={true}
        enableArea={true}
        lineWidth={0}
        axisTop={null}
        axisLeft={null}
        axisRight={null}
        axisBottom={null}
        enablePoints={false}
        pointLabelYOffset={-12}
        areaOpacity={0.7}
        enableGridX={false}
        enableGridY={false}
        tooltip={({
          point: {
            data: { x: date, y: value },
          },
        }) => (
          <div>
            <p className="whitespace-pre-wrap rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-200">
              {`${symbol} ${value}\n${dayjs(date).format('DD MMM, YYYY')}`}
            </p>
          </div>
        )}
      />
    </div>
  );
};

export default FutureTotalAssetPredictionGraph;
