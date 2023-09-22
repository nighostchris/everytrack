/* eslint-disable no-unused-vars */
import { Account, AccountStockHolding, Country, Currency, ClientSettings, ExchangeRate, Stock } from '@api/everytrack_backend';

export type GlobalStateSlice = {
  stocks?: Stock[];
  username?: string;
  currencyId?: string;
  countries?: Country[];
  currencies?: Currency[];
  bankAccounts?: Account[];
  exchangeRates?: ExchangeRate[];
  accountStockHoldings?: AccountStockHolding[];
  updateStocks: (newStocks: Stock[]) => void;
  updateUsername: (newUsername: string) => void;
  updateCurrencyId: (newCurrencyId: string) => void;
  updateCountries: (newCountries: Country[]) => void;
  updateCurrencies: (newCurrencies: Currency[]) => void;
  updateClientSettings: (params: ClientSettings) => void;
  updateBankAccounts: (newBankAccounts: Account[]) => void;
  updateExchangeRates: (newExchangeRates: ExchangeRate[]) => void;
  updateAccountStockHoldings: (newAccountStockHoldings: AccountStockHolding[]) => void;
};

export type GlobalState = GlobalStateSlice;
