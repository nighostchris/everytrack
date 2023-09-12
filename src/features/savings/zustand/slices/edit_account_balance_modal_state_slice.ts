import { StateCreator } from 'zustand';

import { EditAccountBalanceModalStateSlice, SavingsState } from '../types';

export const createEditAccountBalanceModalStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  EditAccountBalanceModalStateSlice
> = (set) => ({
  accountTypeId: undefined,
  originalBalance: undefined,
  originalCurrencyId: undefined,
  updateAccountTypeId: (newAccountTypeId) =>
    set((state) => {
      state.accountTypeId = newAccountTypeId;
    }),
  updateOriginalBalance: (newOriginalBalance) =>
    set((state) => {
      state.originalBalance = newOriginalBalance;
    }),
  updateOriginalCurrencyId: (newOriginalCurrencyId) =>
    set((state) => {
      state.originalCurrencyId = newOriginalCurrencyId;
    }),
  reset: () =>
    set((state) => {
      state.accountTypeId = undefined;
      state.originalBalance = undefined;
      state.originalCurrencyId = undefined;
    }),
});
