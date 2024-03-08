import React from 'react';
import BigNumber from 'bignumber.js';

import { store as globalStore } from '@lib/zustand';
import { Stock, Currency, StockHolding } from '@api/everytrack_backend';
import { canAddNewProvider, calculateDisplayAmount, calculateInterpolateColor } from '@utils';
import { useStocks, useCurrencies, useExchangeRates, useBrokerDetails, useStockHoldings, useBrokerAccounts } from '@hooks';
import { generateBrokerDetails } from '../utils';

// New
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
// New

export interface BrokerAccountTableHolding {
  id: string;
  unit: string;
  cost: string;
  name: string;
  ticker: string;
  stockId: string;
  currency: {
    id: string;
    symbol: string;
  };
  currentPrice: string;
}

export interface BrokerAccountDetails {
  id: string;
  name: string;
  balance: string;
  currency: {
    id: string;
    symbol: string;
  };
  accountTypeId: string;
  holdings: BrokerAccountTableHolding[];
}

export interface BrokerAccountTableRow {
  id: string;
  name: string;
  icon: string;
  accounts: BrokerAccountDetails[];
}

export interface StockHoldingDistributionData {
  name: string;
  color: string;
  balance: string;
  percentage: number;
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

  const { totalBalance, winLoseAmount } = React.useMemo(() => {
    let totalBalance = new BigNumber(0);
    let winLoseAmount = new BigNumber(0);
    if (stockHoldings && brokerAccounts && exchangeRates && currencyId && stocks) {
      // Calculate broker account balance
      brokerAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        totalBalance = totalBalance.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
      });
      // Calculate stock holdings balance
      stockHoldings.forEach(({ holdings }) => {
        holdings.forEach(({ unit, cost, stockId }) => {
          const { currentPrice, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
          totalBalance = totalBalance.plus(
            calculateDisplayAmount(currentPrice, currencyId, stockCurrencyId, exchangeRates).multipliedBy(unit),
          );
          winLoseAmount = winLoseAmount.plus(
            calculateDisplayAmount(
              new BigNumber(currentPrice).minus(cost).toString(),
              currencyId,
              stockCurrencyId,
              exchangeRates,
            ).multipliedBy(unit),
          );
        });
      });
    }
    return { totalBalance: totalBalance.toFormat(2), winLoseAmount: winLoseAmount.toFormat(2) };
  }, [stocks, currencyId, exchangeRates, brokerAccounts, stockHoldings]);

  const brokerAccountTableRows = React.useMemo(() => {
    const result: BrokerAccountTableRow[] = [];
    if (brokerDetails && brokerAccounts && currencies && stocks && stockHoldings) {
      const stockHoldingsMap = new Map<string, StockHolding[]>();
      const brokerDetailsMap = new Map<string, BrokerAccountTableRow>();
      // Generate a account stock holding map
      stockHoldings.forEach(({ accountId, holdings }) => {
        stockHoldingsMap.set(accountId, holdings);
      });
      // Generate a broker detail map
      brokerDetails.forEach(({ id, name, icon }) => brokerDetailsMap.set(id, { id, name, icon, accounts: [] }));
      brokerAccounts.forEach(({ id: accountId, name, balance, currencyId: accountCurrencyId, assetProviderId, accountTypeId }) => {
        const brokerAccountTableRow = brokerDetailsMap.get(assetProviderId) as BrokerAccountTableRow;
        const account: BrokerAccountDetails = {
          name,
          balance,
          holdings: [],
          accountTypeId,
          id: accountId,
          currency: { id: accountCurrencyId, symbol: String(currenciesMap.get(accountCurrencyId)?.symbol) },
        };
        const holdings = stockHoldingsMap.get(accountId) ?? [];
        holdings.forEach(({ id: holdingId, unit, cost, stockId }) => {
          const { name, ticker, currentPrice, currencyId } = stocksMap.get(stockId) as Stock;
          const { id, symbol } = currenciesMap.get(currencyId) as Currency;
          const row = { id: holdingId, unit, cost, name, ticker, stockId, currentPrice, currency: { id, symbol } };
          account.holdings.push(row);
        });
        account.holdings = account.holdings.sort((a, b) => (a.name > b.name ? 1 : -1));
        brokerDetailsMap.set(assetProviderId, {
          ...brokerAccountTableRow,
          accounts: [...brokerAccountTableRow.accounts, account],
        });
      });
      // Extract all entries in brokerDetailsMap into result array
      Array.from(brokerDetailsMap.values()).forEach((brokerAccountTableRow) => {
        if (brokerAccountTableRow.accounts.length > 0) {
          result.push(brokerAccountTableRow);
        }
      });
    }
    return result.sort((a, b) => (a.name > b.name ? 1 : -1));
  }, [stocks, currencies, brokerDetails, brokerAccounts, stockHoldings]);

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

  return { error, brokers, enableAddNewProvider, totalBalance, winLoseAmount, assetDistribution, brokerAccountTableRows };
};

export default useBrokersState;
