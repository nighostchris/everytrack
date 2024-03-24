/* eslint-disable max-len */
import React from 'react';

import { Card } from '@components';
import { Root } from '@layouts/root';
import { useMetricsState } from '@features/metrics/hooks/use_metrics_state';
import { FutureTotalAssetPredictionChart } from '@features/metrics/components';

export const MetricsPage: React.FC = () => {
  const { error: paymentsStateError, futureTotalAssetPredictionData } = useMetricsState();

  return (
    <Root>
      <div className="relative flex h-full flex-col overflow-y-auto px-4 py-6 md:px-6">
        <h1 className="text-xl font-semibold text-gray-900">Metrics</h1>
        <p className="mt-2 text-sm text-gray-700">Insights about your financial status</p>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Let's see how much money you will own in 6 months! 🤑🤑
        </h1>
        <Card className="mt-6 flex h-100 flex-col !bg-white px-4 md:p-6">
          <div className="relative flex h-full w-full flex-col items-center justify-center">
            <div className="absolute hidden h-full w-full md:block">
              <FutureTotalAssetPredictionChart data={[futureTotalAssetPredictionData]} timeInterval={12} />
            </div>
            <div className="absolute block h-full w-full md:hidden">
              <FutureTotalAssetPredictionChart data={[futureTotalAssetPredictionData]} />
            </div>
          </div>
        </Card>
      </div>
    </Root>
  );
};

export default MetricsPage;
