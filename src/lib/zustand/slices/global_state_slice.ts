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
  brokerAccounts: undefined,
  accountStockHoldings: undefined,
  updateStocks: (newStocks) => set((state) => ({ ...state, stocks: newStocks })),
  updateUsername: (newUsername) => set((state) => ({ ...state, username: newUsername })),
  updateCountries: (newCountries) => set((state) => ({ ...state, countries: newCountries })),
  updateCurrencies: (newCurrencies) => set((state) => ({ ...state, currencies: newCurrencies })),
  updateCurrencyId: (newCurrencyId) => set((state) => ({ ...state, currencyId: newCurrencyId })),
  updateBankAccounts: (newBankAccounts) => set((state) => ({ ...state, bankAccounts: newBankAccounts })),
  updateClientSettings: ({ username, currencyId }) => set((state) => ({ ...state, username, currencyId })),
  updateExchangeRates: (newExchangeRates) => set((state) => ({ ...state, exchangeRates: newExchangeRates })),
  updateBrokerAccounts: (newBrokerAccounts) => set((state) => ({ ...state, brokerAccounts: newBrokerAccounts })),
  updateAccountStockHoldings: (newAccountStockHoldings) => set((state) => ({ ...state, accountStockHoldings: newAccountStockHoldings })),
});
