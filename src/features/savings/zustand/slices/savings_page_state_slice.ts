import { StateCreator } from 'zustand';

import { SavingsPageStateSlice, SavingsState } from '../types';

export const createSavingsPageStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  SavingsPageStateSlice
> = (set) => ({
  balance: undefined,
  accountId: undefined,
  currencyId: undefined,
  bankDetails: undefined,
  accountTypeId: undefined,
  updateBalance: (newBalance) =>
    set((state) => {
      state.balance = newBalance;
    }),
  updateAccountId: (newAccountId) =>
    set((state) => {
      state.accountId = newAccountId;
    }),
  resetDeleteAccountModalState: () =>
    set((state) => {
      state.accountId = undefined;
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
