/* eslint-disable max-len */
import React from 'react';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
// import { useDisplayCurrency } from '@hooks';
import { useMetricsState } from '@features/metrics/hooks/use_metrics_state';
// import { PaymentsTable, AddNewFuturePaymentModal } from '@features/payments/components';

export const MetricsPage: React.FC = () => {
  // const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const { error: paymentsStateError, totalBalance } = useMetricsState();

  return (
    <Root>
      <div className="relative flex h-full flex-col overflow-y-auto px-8 py-6">
        <h1 className="text-xl font-semibold text-gray-900">Metrics</h1>
        <p className="mt-2 text-sm text-gray-700">Insights about your financial status</p>
        <p>{totalBalance}</p>
      </div>
    </Root>
  );
};

export default MetricsPage;
