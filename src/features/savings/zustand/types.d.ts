/* eslint-disable no-unused-vars */
import { BankAccount, Currency, Provider } from '@api/everytrack_backend';

export type AddNewAccountModalStateSlice = {
  providerName?: string;
  updateProviderName: (newProviderName: string) => void;
};

export type BankAccountsSlice = {
  bankAccounts?: BankAccount[];
  updateBankAccounts: (newBankAccounts: BankAccount[]) => void;
};

export type BankDetailsSlice = {
  bankDetails?: Provider[];
  updateBankDetails: (newBankDetails: Provider[]) => void;
};

export type CurrenciesSlice = {
  currencies?: Currency[];
  updateCurrencies: (newCurrencies: Currency[]) => void;
};

export type EditAccountBalanceModalStateSlice = {
  accountTypeId?: string;
  originalBalance?: string;
  originalCurrencyId?: string;
  resetEditAccountBalanceModalState: () => void;
  updateAccountTypeId: (newAccountTypeId: string) => void;
  updateOriginalBalance: (newOriginalBalance: string) => void;
  updateOriginalCurrencyId: (newOriginalCurrencyId: string) => void;
};

export type ModalStateSlice = {
  openAddNewAccountModal: boolean;
  openAddNewProviderModal: boolean;
  openEditAccountBalanceModal: boolean;
  updateOpenAddNewAccountModal: (newModalState: boolean) => void;
  updateOpenAddNewProviderModal: (newModalState: boolean) => void;
  updateOpenEditAccountBalanceModal: (newModalState: boolean) => void;
};

export type SavingsState = AddNewAccountModalStateSlice &
  BankAccountsSlice &
  BankDetailsSlice &
  CurrenciesSlice &
  EditAccountBalanceModalStateSlice &
  ModalStateSlice;
