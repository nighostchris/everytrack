import React from 'react';
import BigNumber from 'bignumber.js';

import { store as globalStore } from '@lib/zustand';
import { canAddNewProvider, calculateInterpolateColor } from '@utils';
import { Stock, Currency, StockHolding } from '@api/everytrack_backend';
import { calculateBrokerAccountMetrics, generateBrokerDetails } from '../utils';
import { useStocks, useCurrencies, useExchangeRates, useBrokerDetails, useStockHoldings, useBrokerAccounts } from '@hooks';

export interface BrokerAccountHolding {
  id: string;
  unit: string;
  name: string;
  cost: string;
  ticker: string;
  stockId: string;
  currency: {
    id: string;
    symbol: string;
  };
  currentPrice: string;
}

export interface BrokerAccount {
  id: string;
  name: string;
  balance: string;
  currency: Currency;
  accountTypeId: string;
  holdings: BrokerAccountHolding[];
}

export interface Broker {
  id: string;
  name: string;
  icon: string;
  accounts: BrokerAccount[];
}

export interface StockHoldingDistributionData {
  name: string;
  color: string;
  balance: string;
  percentage: number;
}

export interface BrokerAccountMetrics {
  totalBalance: string;
  totalReturns: string;
}

export const useBrokersState = () => {
  const { currencyId } = globalStore();

  const { stocks, error: fetchStocksError } = useStocks();
  const { currencies, error: fetchCurrenciesError } = useCurrencies();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();
  const { stockHoldings, error: fetchStockHoldingsError } = useStockHoldings();
  const { brokerDetails, error: fetchBrokerDetailsError } = useBrokerDetails();
  const { brokerAccounts, error: fetchBrokerAccountsError } = useBrokerAccounts();

  const error = React.useMemo(
    () =>
      fetchStocksError?.message ??
      fetchCurrenciesError?.message ??
      fetchExchangeRatesError?.message ??
      fetchStockHoldingsError?.message ??
      fetchBrokerDetailsError?.message ??
      fetchBrokerAccountsError?.message,
    [
      fetchStocksError,
      fetchCurrenciesError,
      fetchExchangeRatesError,
      fetchStockHoldingsError,
      fetchBrokerDetailsError,
      fetchBrokerAccountsError,
    ],
  );

  const stocksMap = React.useMemo(() => {
    const map: Map<string, Stock> = new Map();
    (stocks ?? []).forEach((stock) => map.set(stock.id, stock));
    return map;
  }, [stocks]);

  const currenciesMap = React.useMemo(() => {
    const map: Map<string, Currency> = new Map();
    (currencies ?? []).forEach((currency) => map.set(currency.id, currency));
    return map;
  }, [currencies]);

  const assetDistribution: StockHoldingDistributionData[] = React.useMemo(() => {
    if (stocks && currencyId && exchangeRates && brokerAccounts && stockHoldings) {
      const allHoldings = (stockHoldings ?? []).reduce<StockHolding[]>((acc, current) => acc.concat(current.holdings), []);
      const distribution = allHoldings.map(({ unit, cost, stockId }) => {
        const { ticker, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
        const exchangeRate =
          stockCurrencyId === currencyId
            ? { rate: '1' }
            : exchangeRates.filter(
                ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === stockCurrencyId && targetCurrencyId === currencyId,
              )[0];
        return { id: ticker, value: new BigNumber(unit).multipliedBy(cost).multipliedBy(exchangeRate.rate) };
      });
      const cashHoldings = brokerAccounts.reduce((acc, { balance, currencyId: accountCurrencyId }) => {
        const exchangeRate =
          accountCurrencyId === currencyId
            ? { rate: '1' }
            : exchangeRates.filter(
                ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === accountCurrencyId && targetCurrencyId === currencyId,
              )[0];
        return acc.plus(new BigNumber(balance).multipliedBy(exchangeRate.rate));
      }, new BigNumber(0));
      const totalValue = distribution.reduce((acc, current) => acc.plus(current.value), new BigNumber(0)).plus(cashHoldings);
      return [
        {
          name: 'Cash',
          balance: cashHoldings.toFormat(2),
          percentage: Number(cashHoldings.dividedBy(totalValue).multipliedBy(100).toFormat(2)),
          color: calculateInterpolateColor('#C0DEF7', '#0F2C4A', cashHoldings.dividedBy(totalValue).toNumber()),
        },
        ...distribution.map(({ id: name, value }) => ({
          name,
          balance: value.toFormat(2),
          percentage: Number(value.dividedBy(totalValue).multipliedBy(100).toFormat(2)),
          color: calculateInterpolateColor('#C0DEF7', '#0F2C4A', value.dividedBy(totalValue).toNumber()),
        })),
      ].sort((a, b) => (new BigNumber(a.balance).isGreaterThan(b.balance) ? -1 : 1));
    }
    return [];
  }, [stocks, currencyId, exchangeRates, brokerAccounts, stockHoldings]);

  const enableAddNewProvider = React.useMemo(
    () => canAddNewProvider(brokerDetails ?? [], brokerAccounts ?? []),
    [brokerDetails, brokerAccounts],
  );

  const brokers = React.useMemo(
    () =>
      stocks && currencies && brokerDetails && brokerAccounts && stockHoldings
        ? generateBrokerDetails(brokerDetails, brokerAccounts, stockHoldings, stocksMap, currenciesMap)
        : [],
    [stocks, currencies, brokerDetails, brokerAccounts, stockHoldings],
  );

  const brokerAccountMetrics = React.useMemo(
    () =>
      stocks && currencyId && brokerAccounts && exchangeRates && stockHoldings
        ? calculateBrokerAccountMetrics(currencyId, brokerAccounts, exchangeRates, stockHoldings, stocksMap)
        : new Map<string, BrokerAccountMetrics>(),
    [stocks, currencyId, brokerAccounts, exchangeRates, stockHoldings],
  );

  return { error, brokers, enableAddNewProvider, assetDistribution, brokerAccountMetrics };
};

export default useBrokersState;
