import React from 'react';
import BigNumber from 'bignumber.js';

import { store } from '../zustand';
import { store as globalStore } from '@lib/zustand';
import { getAllProviders } from '@api/everytrack_backend';

export interface SavingProviderTableAccount {
  id: string;
  type: string;
  balance: string;
  accountTypeId: string;
  currency: {
    id: string;
    symbol: string;
  };
}

export interface SavingProviderTableRow {
  name: string;
  icon: string;
  accounts: SavingProviderTableAccount[];
}

export const useSavingsState = () => {
  const { bankDetails, updateBankDetails } = store();
  const { bankAccounts, currencyId, currencies, exchangeRates } = globalStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const initBankDetails = React.useCallback(async () => {
    try {
      const { success, data } = await getAllProviders('savings');
      if (success) {
        updateBankDetails(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const totalBalance = React.useMemo(() => {
    let totalBalance = new BigNumber(0);
    if (bankAccounts && exchangeRates && currencyId) {
      bankAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        if (accountCurrencyId === currencyId) {
          totalBalance = totalBalance.plus(balance);
        } else {
          const exchangeRate = exchangeRates.filter(
            ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === accountCurrencyId && targetCurrencyId === currencyId,
          )[0];
          const convertedBalance = new BigNumber(balance).multipliedBy(exchangeRate.rate);
          totalBalance = totalBalance.plus(convertedBalance);
        }
      });
    }
    return totalBalance.toFormat(2);
  }, [currencyId, bankAccounts, exchangeRates]);

  const savingProviderTableRows = React.useMemo(() => {
    const accountMap = new Map();
    const currenciesMap = new Map();
    const result: SavingProviderTableRow[] = [];
    if (bankDetails && bankAccounts && currencies) {
      // Generate a currency map
      currencies.forEach(({ id, symbol }) => currenciesMap.set(id, symbol));
      // Generate a bank account map
      bankAccounts.forEach(({ id, balance, currencyId, accountTypeId }) => {
        accountMap.set(accountTypeId, { id, balance, currency: { id: currencyId, symbol: currenciesMap.get(currencyId) } });
      });
      // Generate a bank detail map
      bankDetails.forEach(({ name, icon, accountTypes }) => {
        const owned: { id: string; type: string; balance: string; accountTypeId: string; currency: { id: string; symbol: string } }[] = [];
        accountTypes.forEach(({ id, name }) => {
          if (accountMap.has(id)) {
            owned.push({ type: name, accountTypeId: id, ...accountMap.get(id) });
          }
        });
        if (owned.length > 0) {
          result.push({ name, icon, accounts: owned });
        }
      });
    }
    return result.sort((a, b) => (a.name > b.name ? 1 : -1));
  }, [bankDetails, bankAccounts, currencies]);

  React.useEffect(() => {
    setIsLoading(true);
    initBankDetails();
    setIsLoading(false);
  }, [initBankDetails]);

  return { isLoading, totalBalance, savingProviderTableRows };
};

export default useSavingsState;
