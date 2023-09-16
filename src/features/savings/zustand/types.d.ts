/* eslint-disable no-unused-vars */
import { Account, Provider } from '@api/everytrack_backend';

export type AddNewAccountModalStateSlice = {
  providerName?: string;
  updateProviderName: (newProviderName: string) => void;
};

export type BankAccountsSlice = {
  bankAccounts?: Account[];
  updateBankAccounts: (newBankAccounts: Account[]) => void;
};

export type SavingsPageStateSlice = {
  balance?: string;
  currencyId?: string;
  accountTypeId?: string;
  bankDetails?: Provider[];
  updateBalance: (newBalance: string) => void;
  resetEditAccountBalanceModalState: () => void;
  updateCurrencyId: (newCurrencyId: string) => void;
  updateBankDetails: (newBankDetails: Provider[]) => void;
  updateAccountTypeId: (newAccountTypeId: string) => void;
};

export type ModalStateSlice = {
  openAddNewAccountModal: boolean;
  openAddNewProviderModal: boolean;
  openEditAccountBalanceModal: boolean;
  updateOpenAddNewAccountModal: (newModalState: boolean) => void;
  updateOpenAddNewProviderModal: (newModalState: boolean) => void;
  updateOpenEditAccountBalanceModal: (newModalState: boolean) => void;
};

export type SavingsState = AddNewAccountModalStateSlice & BankAccountsSlice & SavingsPageStateSlice & ModalStateSlice;
