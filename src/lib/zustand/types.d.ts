/* eslint-disable no-unused-vars */
import { Account, AccountStockHolding, Country, Currency, ClientSettings, ExchangeRate, Expense, Stock } from '@api/everytrack_backend';

export type GlobalStateSlice = {
  stocks?: Stock[];
  username?: string;
  currencyId?: string;
  expenses?: Expense[];
  countries?: Country[];
  currencies?: Currency[];
  bankAccounts?: Account[];
  brokerAccounts?: Account[];
  exchangeRates?: ExchangeRate[];
  accountStockHoldings?: AccountStockHolding[];
  updateStocks: (newStocks: Stock[]) => void;
  updateUsername: (newUsername: string) => void;
  updateExpenses: (newExpenses: Expense[]) => void;
  updateCurrencyId: (newCurrencyId: string) => void;
  updateCountries: (newCountries: Country[]) => void;
  updateCurrencies: (newCurrencies: Currency[]) => void;
  updateClientSettings: (params: ClientSettings) => void;
  updateBankAccounts: (newBankAccounts: Account[]) => void;
  updateBrokerAccounts: (newBrokerAccounts: Account[]) => void;
  updateExchangeRates: (newExchangeRates: ExchangeRate[]) => void;
  updateAccountStockHoldings: (newAccountStockHoldings: AccountStockHolding[]) => void;
};

export type GlobalState = GlobalStateSlice;
