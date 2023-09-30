import React from 'react';
import BigNumber from 'bignumber.js';

import { store } from '../zustand';
import { store as globalStore } from '@lib/zustand';
import { getAllProviders } from '@api/everytrack_backend';
import { calculateDisplayAmount } from '@utils';

export interface SavingProviderTableAccount {
  id: string;
  name: string;
  balance: string;
  accountTypeId: string;
  currency: {
    id: string;
    symbol: string;
  };
}

export interface SavingProviderTableRow {
  id: string;
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
        totalBalance = totalBalance.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
      });
    }
    return totalBalance.toFormat(2);
  }, [currencyId, bankAccounts, exchangeRates]);

  const savingProviderTableRows = React.useMemo(() => {
    const currenciesMap = new Map<string, string>();
    const bankDetailsMap = new Map<string, SavingProviderTableRow>();
    const result: SavingProviderTableRow[] = [];
    if (bankDetails && bankAccounts && currencies) {
      // Generate a currency map
      currencies.forEach(({ id, symbol }) => currenciesMap.set(id, symbol));
      // Generate a bank detail map
      bankDetails.forEach(({ id, name, icon }) => bankDetailsMap.set(id, { id, name, icon, accounts: [] }));
      bankAccounts.forEach(({ id, name, balance, currencyId, accountTypeId, assetProviderId }) => {
        const savingProviderTableRow = bankDetailsMap.get(assetProviderId) as SavingProviderTableRow;
        bankDetailsMap.set(assetProviderId, {
          ...savingProviderTableRow,
          accounts: [
            ...savingProviderTableRow.accounts,
            { id, name, balance, accountTypeId, currency: { id: currencyId, symbol: currenciesMap.get(currencyId) as string } },
          ].sort((a, b) => (a.name > b.name ? 1 : -1)),
        });
      });
      // Extract all entries in bankDetailsMap into result array
      Array.from(bankDetailsMap.values()).forEach((savingProviderTableRow) => {
        if (savingProviderTableRow.accounts.length > 0) {
          result.push(savingProviderTableRow);
        }
      });
    }
    return result.sort((a, b) => (a.name > b.name ? 1 : -1));
  }, [bankDetails, bankAccounts, currencies]);

  const canAddNewProvider = React.useMemo(() => {
    if (!bankDetails || !bankAccounts) {
      return false;
    }
    const existingProviderMap = new Map<string, boolean>();
    bankAccounts.forEach(({ assetProviderId }) => existingProviderMap.set(assetProviderId, true));
    return Array.from(existingProviderMap.keys()).length < bankDetails.length;
  }, [bankDetails, bankAccounts]);

  React.useEffect(() => {
    setIsLoading(true);
    initBankDetails();
    setIsLoading(false);
  }, [initBankDetails]);

  return { isLoading, totalBalance, canAddNewProvider, savingProviderTableRows };
};

export default useSavingsState;
