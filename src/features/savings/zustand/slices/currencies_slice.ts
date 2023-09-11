import { StateCreator } from 'zustand';

import { CurrenciesSlice, SavingsState } from '../types';

export const createCurrenciesSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  CurrenciesSlice
> = (set) => ({
  currencies: undefined,
  updateCurrencies: (newCurrencies) =>
    set((state) => {
      state.currencies = newCurrencies;
    }),
});
