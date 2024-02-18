/* eslint-disable max-len */
import React from 'react';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
// import { useDisplayCurrency } from '@hooks';
import { useMetricsState } from '@features/metrics/hooks/use_metrics_state';
import { FutureTotalAssetPredictionGraph } from '@features/metrics/components';

export const MetricsPage: React.FC = () => {
  // const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const {
    error: paymentsStateError,
    futureTotalAssetPredictionGraphData: { snapshotMin, snapshotMax, totalAssetValueSnapshots },
  } = useMetricsState();

  return (
    <Root>
      <div className="relative flex h-full flex-col overflow-y-auto px-8 py-6">
        <h1 className="text-xl font-semibold text-gray-900">Metrics</h1>
        <p className="mt-2 text-sm text-gray-700">Insights about your financial status</p>
        <div className="flex w-full flex-col py-6">
          <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Let's see how much money you will own in 6 months! 🤑🤑
          </h1>
          <FutureTotalAssetPredictionGraph data={totalAssetValueSnapshots} min={snapshotMin} max={snapshotMax} />
        </div>
      </div>
    </Root>
  );
};

export default MetricsPage;
