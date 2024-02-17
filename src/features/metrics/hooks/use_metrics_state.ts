import React from 'react';
import BigNumber from 'bignumber.js';

import { calculateDisplayAmount } from '@utils';
import { Stock } from '@api/everytrack_backend';
import { store as globalStore } from '@lib/zustand';
import { useCash, useStocks, useBankAccounts, useExchangeRates, useStockHoldings, useBrokerAccounts } from '@hooks';

export const useMetricsState = () => {
  const { currencyId } = globalStore();

  const { cash, error: fetchCashError } = useCash();
  const { stocksMap, error: fetchStocksError } = useStocks();
  const { bankAccounts, error: fetchBankAccountsError } = useBankAccounts();
  const { stockHoldings, error: fetchStockHoldingsError } = useStockHoldings();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();
  const { brokerAccounts, error: fetchBrokerAccountsError } = useBrokerAccounts();

  const error = React.useMemo(
    () =>
      fetchCashError?.message ??
      fetchStocksError?.message ??
      fetchBankAccountsError?.message ??
      fetchStockHoldingsError?.message ??
      fetchExchangeRatesError?.message ??
      fetchBrokerAccountsError?.message,
    [fetchCashError, fetchStocksError, fetchBankAccountsError, fetchStockHoldingsError, fetchExchangeRatesError, fetchBrokerAccountsError],
  );

  const totalBalance = React.useMemo(() => {
    let totalAssetValue = new BigNumber(0);
    if (cash && bankAccounts && brokerAccounts && stockHoldings && exchangeRates && currencyId) {
      cash.forEach(({ amount, currencyId: cashCurrencyId }) => {
        totalAssetValue = totalAssetValue.plus(calculateDisplayAmount(amount, currencyId, cashCurrencyId, exchangeRates));
      });
      bankAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        totalAssetValue = totalAssetValue.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
      });
      brokerAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        totalAssetValue = totalAssetValue.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
      });
      stockHoldings.forEach(({ holdings }) => {
        holdings.forEach(({ unit, stockId }) => {
          const { currentPrice, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
          const holdingBalance = new BigNumber(currentPrice).multipliedBy(unit);
          totalAssetValue = totalAssetValue.plus(
            calculateDisplayAmount(holdingBalance.toString(), currencyId, stockCurrencyId, exchangeRates),
          );
        });
      });
    }
    return totalAssetValue.toString();
  }, [cash, currencyId, bankAccounts, brokerAccounts, stockHoldings, exchangeRates]);

  return { error, totalBalance };
};

export default useMetricsState;
