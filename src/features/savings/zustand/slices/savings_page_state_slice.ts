import { StateCreator } from 'zustand';

import { SavingsPageStateSlice, SavingsState } from '../types';

export const createSavingsPageStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  SavingsPageStateSlice
> = (set) => ({
  balance: undefined,
  currencyId: undefined,
  bankDetails: undefined,
  accountTypeId: undefined,
  updateBalance: (newBalance) =>
    set((state) => {
      state.balance = newBalance;
    }),
  updateCurrencyId: (newCurrencyId) =>
    set((state) => {
      state.currencyId = newCurrencyId;
    }),
  updateBankDetails: (newBankDetails) =>
    set((state) => {
      state.bankDetails = newBankDetails;
    }),
  updateAccountTypeId: (newAccountTypeId) =>
    set((state) => {
      state.accountTypeId = newAccountTypeId;
    }),
  resetEditAccountBalanceModalState: () =>
    set((state) => {
      state.balance = undefined;
      state.currencyId = undefined;
      state.accountTypeId = undefined;
    }),
});
