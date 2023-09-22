import React from 'react';
import BigNumber from 'bignumber.js';

import { store } from '../zustand';
import { store as globalStore } from '@lib/zustand';
import { getAllAccounts, getAllProviders, Stock, Currency, StockHolding } from '@api/everytrack_backend';

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
  holdings: BrokerAccountTableHolding[];
}

export interface BrokerAccountTableRow {
  id: string;
  name: string;
  icon: string;
  accounts: BrokerAccountDetails[];
}

export const useBrokersState = () => {
  const { brokerDetails, updateBrokerDetails } = store();
  const { stocks, currencyId, currencies, exchangeRates, accountStockHoldings, brokerAccounts, updateBrokerAccounts } = globalStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const initBrokerAccounts = React.useCallback(async () => {
    try {
      const { success, data } = await getAllAccounts('broker');
      if (success) {
        updateBrokerAccounts(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const initBrokerDetails = React.useCallback(async () => {
    try {
      const { success, data } = await getAllProviders('broker');
      if (success) {
        updateBrokerDetails(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const stocksMap = React.useMemo(() => {
    const map: Map<string, Stock> = new Map();
    (stocks ?? []).forEach((stock) => map.set(stock.id, stock));
    return map;
  }, [stocks]);

  const assetDistribution = React.useMemo(() => {
    if (stocks && currencyId && exchangeRates && accountStockHoldings) {
      const allHoldings = (accountStockHoldings ?? []).reduce<StockHolding[]>((acc, current) => acc.concat(current.holdings), []);
      const distribution = allHoldings.map(({ unit, cost, stockId }) => {
        const { ticker, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
        const exchangeRate = exchangeRates.filter(
          ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === stockCurrencyId && targetCurrencyId === currencyId,
        )[0];
        return { id: ticker, value: new BigNumber(unit).multipliedBy(cost).multipliedBy(exchangeRate.rate).toFormat(2) };
      });
      const totalValue = distribution.reduce((acc, current) => acc.plus(current.value), new BigNumber(0));
      return distribution.map(({ id, value }) => ({ id, value: new BigNumber(value).dividedBy(totalValue).multipliedBy(100).toFormat(2) }));
    }
    return [];
  }, [stocks, currencyId, exchangeRates, accountStockHoldings]);

  const { totalBalance, winLoseAmount } = React.useMemo(() => {
    let totalBalance = new BigNumber(0);
    let winLoseAmount = new BigNumber(0);
    if (accountStockHoldings && exchangeRates && currencyId && stocks) {
      accountStockHoldings.forEach(({ holdings }) => {
        holdings.forEach(({ unit, cost, stockId }) => {
          const { currentPrice, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
          if (stockCurrencyId === currencyId) {
            totalBalance = totalBalance.plus(new BigNumber(unit).multipliedBy(currentPrice));
            winLoseAmount = winLoseAmount.plus(new BigNumber(unit).multipliedBy(new BigNumber(currentPrice).minus(cost)));
          } else {
            const exchangeRate = exchangeRates.filter(
              ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === stockCurrencyId && targetCurrencyId === currencyId,
            )[0];
            const convertedWinLoseAmount = new BigNumber(unit)
              .multipliedBy(new BigNumber(currentPrice).minus(cost))
              .multipliedBy(exchangeRate.rate);
            const convertedBalance = new BigNumber(unit).multipliedBy(currentPrice).multipliedBy(exchangeRate.rate);
            totalBalance = totalBalance.plus(convertedBalance);
            winLoseAmount = winLoseAmount.plus(convertedWinLoseAmount);
          }
        });
      });
    }
    return { totalBalance: totalBalance.toFormat(2), winLoseAmount: winLoseAmount.toFormat(2) };
  }, [stocks, currencyId, exchangeRates, accountStockHoldings]);

  const brokerAccountTableRows = React.useMemo(() => {
    const currenciesMap = new Map<string, Currency>();
    const brokerDetailsMap = new Map<string, BrokerAccountTableRow>();
    const accountStockHoldingsMap = new Map<string, StockHolding[]>();
    const result: BrokerAccountTableRow[] = [];
    if (brokerDetails && brokerAccounts && currencies && stocks && accountStockHoldings) {
      // Generate a currency map
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      // Generate a account stock holding map
      accountStockHoldings.forEach(({ accountId, holdings }) => {
        accountStockHoldingsMap.set(accountId, holdings);
      });
      // Generate a broker detail map
      brokerDetails.forEach(({ id, name, icon }) => brokerDetailsMap.set(id, { id, name, icon, accounts: [] }));
      brokerAccounts.forEach(({ id: accountId, name, assetProviderId }) => {
        const brokerAccountTableRow = brokerDetailsMap.get(assetProviderId) as BrokerAccountTableRow;
        const account: BrokerAccountDetails = { id: accountId, name, holdings: [] };
        const holdings = accountStockHoldingsMap.get(accountId) ?? [];
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
  }, [stocks, currencies, brokerDetails, brokerAccounts, accountStockHoldings]);

  const canAddNewBroker = React.useMemo(() => {
    if (!brokerDetails || !brokerAccounts) {
      return false;
    }
    const existingBrokerMap = new Map<string, boolean>();
    brokerAccounts.forEach(({ assetProviderId }) => existingBrokerMap.set(assetProviderId, true));
    return Array.from(existingBrokerMap.keys()).length < brokerDetails.length;
  }, [brokerDetails, brokerAccounts]);

  React.useEffect(() => {
    setIsLoading(true);
    initBrokerAccounts();
    initBrokerDetails();
    setIsLoading(false);
  }, [initBrokerAccounts, initBrokerDetails]);

  return { isLoading, canAddNewBroker, totalBalance, winLoseAmount, assetDistribution, brokerAccountTableRows };
};

export default useBrokersState;
