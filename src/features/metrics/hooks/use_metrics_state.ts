import React from 'react';

import { store as globalStore } from '@lib/zustand';
import { calculateFutureTotalAssetPredictionSnapshots } from '../utils';
import { useCash, useStocks, useBankAccounts, useExchangeRates, useStockHoldings, useBrokerAccounts, useFuturePayments } from '@hooks';

export interface TotalAssetValueSnapshot {
  x: Date;
  y: number;
}

export interface FutureTotalAssetPredictionData {
  id: string;
  data: TotalAssetValueSnapshot[];
}

export const useMetricsState = () => {
  const { currencyId } = globalStore();

  const { cash, error: fetchCashError } = useCash();
  const { stocksMap, error: fetchStocksError } = useStocks();
  const { bankAccounts, error: fetchBankAccountsError } = useBankAccounts();
  const { stockHoldings, error: fetchStockHoldingsError } = useStockHoldings();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();
  const { futurePayments, error: fetchFuturePaymentsError } = useFuturePayments();
  const { brokerAccounts, error: fetchBrokerAccountsError } = useBrokerAccounts();

  const error = React.useMemo(
    () =>
      fetchCashError?.message ??
      fetchStocksError?.message ??
      fetchBankAccountsError?.message ??
      fetchStockHoldingsError?.message ??
      fetchExchangeRatesError?.message ??
      fetchFuturePaymentsError?.message ??
      fetchBrokerAccountsError?.message,
    [
      fetchCashError,
      fetchStocksError,
      fetchBankAccountsError,
      fetchStockHoldingsError,
      fetchExchangeRatesError,
      fetchFuturePaymentsError,
      fetchBrokerAccountsError,
    ],
  );

  const futureTotalAssetPredictionData: FutureTotalAssetPredictionData = React.useMemo(() => {
    const data = { id: 'future-total-asset-prediction-data' };
    if (cash && currencyId && bankAccounts && brokerAccounts && stockHoldings && exchangeRates && futurePayments) {
      const snapshots = calculateFutureTotalAssetPredictionSnapshots(
        currencyId,
        cash,
        bankAccounts,
        brokerAccounts,
        exchangeRates,
        stocksMap,
        futurePayments,
        stockHoldings,
      );
      return { ...data, data: snapshots };
    }
    return { ...data, data: [] };
  }, [cash, currencyId, bankAccounts, brokerAccounts, stockHoldings, exchangeRates, futurePayments]);

  return { error, futureTotalAssetPredictionData };
};

export default useMetricsState;
