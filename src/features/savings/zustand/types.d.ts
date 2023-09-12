/* eslint-disable no-unused-vars */
import { BankAccount, Currency, SavingProvider } from '@api/everytrack_backend';

export type BankAccountsSlice = {
  bankAccounts?: BankAccount[];
  updateBankAccounts: (newBankAccounts: BankAccount[]) => void;
};

export type BankDetailsSlice = {
  bankDetails?: SavingProvider[];
  updateBankDetails: (newBankDetails: SavingProvider[]) => void;
};

export type CurrenciesSlice = {
  currencies?: Currency[];
  updateCurrencies: (newCurrencies: Currency[]) => void;
};

export type EditAccountBalanceModalStateSlice = {
  accountTypeId?: string;
  originalBalance?: string;
  originalCurrencyId?: string;
  updateAccountTypeId: (newAccountTypeId: string) => void;
  updateOriginalBalance: (newOriginalBalance: string) => void;
  updateOriginalCurrencyId: (newOriginalCurrencyId: string) => void;
};

export type ModalStateSlice = {
  openAddNewProviderModal: boolean;
  openEditAccountBalanceModal: boolean;
  updateOpenAddNewProviderModal: (newModalState: boolean) => void;
  updateOpenEditAccountBalanceModal: (newModalState: boolean) => void;
};

export type SavingsState = BankAccountsSlice & BankDetailsSlice & CurrenciesSlice & EditAccountBalanceModalStateSlice & ModalStateSlice;
