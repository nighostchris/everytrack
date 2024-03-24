import React from 'react';
import BigNumber from 'bignumber.js';

import { Currency } from '@api/everytrack_backend';
import { store as globalStore } from '@lib/zustand';
import { generateSavingProviderTableRows } from '../utils';
import { canAddNewProvider, calculateDisplayAmount } from '@utils';
import { useCash, useCurrencies, useBankDetails, useBankAccounts, useExchangeRates } from '@hooks';

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
  balance: string;
  accounts: SavingProviderTableAccount[];
}

export interface CashTableRecord {
  id: string;
  amount: string;
  currency: {
    id: string;
    ticker: string;
    symbol: string;
  };
}

export const useSavingsState = () => {
  const { currencyId } = globalStore();

  const { cash, error: fetchCashError } = useCash();
  const { bankDetails, error: fetchBankDetailsError } = useBankDetails();
  const { bankAccounts, error: fetchBankAccountsError } = useBankAccounts();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();
  const { currencies, currenciesMap, error: fetchCurrenciesError } = useCurrencies();

  const error = React.useMemo(
    () =>
      fetchCashError?.message ??
      fetchCurrenciesError?.message ??
      fetchBankDetailsError?.message ??
      fetchBankAccountsError?.message ??
      fetchExchangeRatesError?.message,
    [fetchCashError, fetchCurrenciesError, fetchBankDetailsError, fetchBankAccountsError, fetchExchangeRatesError],
  );

  const totalBalance = React.useMemo(() => {
    let totalBalance = new BigNumber(0);
    if (cash && bankAccounts && exchangeRates && currencyId) {
      cash.forEach(({ amount, currencyId: cashCurrencyId }) => {
        totalBalance = totalBalance.plus(calculateDisplayAmount(amount, currencyId, cashCurrencyId, exchangeRates));
      });
      bankAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        totalBalance = totalBalance.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
      });
    }
    return totalBalance.toFormat(2);
  }, [cash, currencyId, bankAccounts, exchangeRates]);

  const savingProviderTableRows = React.useMemo(
    () =>
      currencyId && currencies && bankDetails && bankAccounts && exchangeRates
        ? generateSavingProviderTableRows(currencyId, bankAccounts, bankDetails, exchangeRates, currenciesMap)
        : [],
    [currencyId, currencies, bankDetails, bankAccounts, exchangeRates],
  );

  const cashTableRecords = React.useMemo(() => {
    const currenciesMap = new Map<string, { ticker: string; symbol: string }>();
    const result: CashTableRecord[] = [];
    if (cash && currencies) {
      // Generate a currency map
      currencies.forEach(({ id, ticker, symbol }) => currenciesMap.set(id, { ticker, symbol }));
      cash.forEach(({ id, amount, currencyId }) => {
        const { ticker, symbol } = currenciesMap.get(currencyId)!;
        result.push({
          id,
          amount,
          currency: { id: currencyId, ticker, symbol },
        });
      });
    }
    return result;
  }, [cash, currencies]);

  const enableAddNewProvider = React.useMemo(() => canAddNewProvider(bankDetails ?? [], bankAccounts ?? []), [bankDetails, bankAccounts]);

  return { error, totalBalance, enableAddNewProvider, savingProviderTableRows, cashTableRecords };
};

export default useSavingsState;
