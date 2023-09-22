import { StateCreator } from 'zustand';

import { GlobalState, GlobalStateSlice } from '../types';

export const createGlobalStateSlice: StateCreator<
  GlobalState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  GlobalStateSlice
> = (set) => ({
  stocks: undefined,
  username: undefined,
  countries: undefined,
  currencyId: undefined,
  currencies: undefined,
  bankAccounts: undefined,
  exchangeRates: undefined,
  accountStockHoldings: undefined,
  updateStocks: (newStocks) =>
    set((state) => {
      state.stocks = newStocks;
    }),
  updateUsername: (newUsername) =>
    set((state) => {
      state.username = newUsername;
    }),
  updateCurrencyId: (newCurrencyId) =>
    set((state) => {
      state.currencyId = newCurrencyId;
    }),
  updateBankAccounts: (newBankAccounts) =>
    set((state) => {
      state.bankAccounts = newBankAccounts;
    }),
  updateExchangeRates: (newExchangeRates) =>
    set((state) => {
      state.exchangeRates = newExchangeRates;
    }),
  updateClientSettings: ({ username, currencyId }) =>
    set((state) => {
      state.username = username;
      state.currencyId = currencyId;
    }),
  updateAccountStockHoldings: (newAccountStockHoldings) =>
    set((state) => {
      state.accountStockHoldings = newAccountStockHoldings;
    }),
  updateCountries: (newCountries) => set((state) => ({ ...state, countries: newCountries })),
  updateCurrencies: (newCurrencies) => set((state) => ({ ...state, currencies: newCurrencies })),
});
