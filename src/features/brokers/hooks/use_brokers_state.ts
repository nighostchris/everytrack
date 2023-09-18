import React from 'react';

import { store } from '../zustand';
import { store as globalStore } from '@lib/zustand';
import { getAllAccounts, getAllProviders, getAllStocks, getAllStockHoldings, Stock, Currency, StockHolding } from '@api/everytrack_backend';

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
  const { currencies } = globalStore();
  const {
    stocks,
    brokerDetails,
    brokerAccounts,
    accountStockHoldings,
    updateStocks,
    updateBrokerAccounts,
    updateBrokerDetails,
    updateAccountStockHoldings,
  } = store();

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

  const initStocks = React.useCallback(async () => {
    try {
      const { success, data } = await getAllStocks();
      if (success) {
        updateStocks(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const initAccountStockHoldings = React.useCallback(async () => {
    try {
      const { success, data } = await getAllStockHoldings();
      if (success) {
        updateAccountStockHoldings(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const brokerAccountTableRows = React.useMemo(() => {
    const stocksMap: Map<string, Stock> = new Map();
    const currenciesMap: Map<string, Currency> = new Map();
    const accountStockHoldingsMap: Map<string, StockHolding[]> = new Map();
    const brokerProviderToAccountsMap: Map<string, BrokerAccountTableRow> = new Map();
    const accountTypeToBrokerDetailsMap: Map<string, { providerName: string; icon: string; accountTypeName: string }> = new Map();
    if (brokerDetails && brokerAccounts && currencies && stocks && accountStockHoldings) {
      // Generate a stocks map
      stocks.forEach((stock) => stocksMap.set(stock.id, stock));
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
    initAccountStockHoldings();
    initBrokerAccounts();
    initBrokerDetails();
    initStocks();
    setIsLoading(false);
  }, [initStocks, initBrokerAccounts, initBrokerDetails, initAccountStockHoldings]);

  return { isLoading, brokerAccountTableRows };
};

export default useBrokersState;
