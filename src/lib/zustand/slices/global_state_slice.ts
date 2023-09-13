import { StateCreator } from 'zustand';

import { GlobalState, GlobalStateSlice } from '../types';

export const createGlobalStateSlice: StateCreator<
  GlobalState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  GlobalStateSlice
> = (set) => ({
  username: undefined,
  currencyId: undefined,
  currencies: undefined,
  exchangeRates: undefined,
  updateUsername: (newUsername) =>
    set((state) => {
      state.username = newUsername;
    }),
  updateCurrencyId: (newCurrencyId) =>
    set((state) => {
      state.currencyId = newCurrencyId;
    }),
  updateCurrencies: (newCurrencies) =>
    set((state) => {
      state.currencies = newCurrencies;
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
});
