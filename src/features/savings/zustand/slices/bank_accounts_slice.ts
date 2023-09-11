import { StateCreator } from 'zustand';

import { BankAccountsSlice, SavingsState } from '../types';

export const createBankAccountsSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  BankAccountsSlice
> = (set) => ({
  bankAccounts: undefined,
  updateBankAccounts: (newBankAccounts) =>
    set((state) => {
      state.bankAccounts = newBankAccounts;
    }),
});
