import React from 'react';
import BigNumber from 'bignumber.js';

import { store } from '../zustand';
import { store as globalStore } from '@lib/zustand';
import { getAllAccounts, getAllProviders, Stock, Currency, StockHolding } from '@api/everytrack_backend';

export interface BrokerAccountTableHolding {
  unit: string;
  cost: string;
  name: string;
  ticker: string;
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
  const { brokerDetails, brokerAccounts, updateBrokerAccounts, updateBrokerDetails } = store();
  const { stocks, currencyId, currencies, exchangeRates, accountStockHoldings } = globalStore();

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
    const currenciesMap: Map<string, Currency> = new Map();
    const accountStockHoldingsMap: Map<string, StockHolding[]> = new Map();
    const brokerProviderToAccountsMap: Map<string, BrokerAccountTableRow> = new Map();
    const accountTypeToBrokerDetailsMap: Map<string, { providerName: string; icon: string; accountTypeName: string }> = new Map();
    if (brokerDetails && brokerAccounts && currencies && stocks && accountStockHoldings) {
      // Generate a currency map
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      // Generate a broker detail map
      brokerDetails.forEach(({ name: providerName, icon, accountTypes }) => {
        accountTypes.forEach(({ id: accountTypeId, name: accountTypeName }) => {
          accountTypeToBrokerDetailsMap.set(accountTypeId, { providerName, icon, accountTypeName });
        });
      });
      // Generate a account stock holding map
      accountStockHoldings.forEach(({ accountId, holdings }) => {
        accountStockHoldingsMap.set(accountId, holdings);
      });
      brokerAccounts.forEach(({ id: accountId, accountTypeId }) => {
        const brokerProvider = accountTypeToBrokerDetailsMap.get(accountTypeId);
        if (brokerProvider) {
          const { providerName, icon, accountTypeName } = brokerProvider;
          const providerId = providerName.toLowerCase().replaceAll(/\s/g, '-').replaceAll(/\(|\)/g, '');
          const account: BrokerAccountDetails = { id: accountId, name: accountTypeName, holdings: [] };
          const holdings = accountStockHoldingsMap.get(accountId) ?? [];
          // Generate a broker account map
          holdings.forEach(({ unit, cost, stockId }) => {
            const { name, ticker, currentPrice, currencyId } = stocksMap.get(stockId) as Stock;
            const { id, symbol } = currenciesMap.get(currencyId) as Currency;
            const row = { unit, cost, name, ticker, currentPrice, currency: { id, symbol } };
            account.holdings.push(row);
          });
          // Generate provider to acccounts map
          if (account.holdings.length > 0) {
            const providerAccounts = brokerProviderToAccountsMap.get(providerId);
            if (!providerAccounts) {
              brokerProviderToAccountsMap.set(providerId, {
                id: providerId,
                name: providerName,
                icon,
                accounts: [account],
              });
            } else {
              brokerProviderToAccountsMap.set(providerId, {
                ...providerAccounts,
                accounts: [...providerAccounts.accounts, account],
              });
            }
          }
        }
      });
      return Array.from(brokerProviderToAccountsMap.values());
    }
    return [];
  }, [stocks, currencies, brokerDetails, brokerAccounts, accountStockHoldings]);

  React.useEffect(() => {
    setIsLoading(true);
    initBrokerAccounts();
    initBrokerDetails();
    setIsLoading(false);
  }, [initBrokerAccounts, initBrokerDetails]);

  return { isLoading, totalBalance, winLoseAmount, assetDistribution, brokerAccountTableRows };
};

export default useBrokersState;
