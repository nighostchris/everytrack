import React from 'react';
import BigNumber from 'bignumber.js';

import { calculateDisplayAmount } from '@utils';
import { store as globalStore } from '@lib/zustand';
import { useCurrencies, useBankDetails, useBankAccounts, useExchangeRates, useEnableAddNewProvider } from '@hooks';

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
  const { currencyId } = globalStore();

  const { currencies, error: fetchCurrenciesError } = useCurrencies();
  const { bankDetails, error: fetchBankDetailsError } = useBankDetails();
  const { bankAccounts, error: fetchBankAccountsError } = useBankAccounts();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();

  const error = React.useMemo(
    () =>
      fetchCurrenciesError?.message ??
      fetchBankDetailsError?.message ??
      fetchBankAccountsError?.message ??
      fetchExchangeRatesError?.message,
    [fetchCurrenciesError, fetchBankDetailsError, fetchBankAccountsError, fetchExchangeRatesError],
  );

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

  const enableAddNewProvider = React.useMemo(
    () => useEnableAddNewProvider(bankDetails ?? [], bankAccounts ?? []),
    [bankDetails, bankAccounts],
  );

  return { error, totalBalance, enableAddNewProvider, savingProviderTableRows };
};

export default useSavingsState;
