import { AccountType } from '@api/everytrack_backend';

export type BankAccountsSlice = {};

export type BankDetailsSlice = {
  bankDetails?: Record<string, AccountType[]>;
  updateBankDetails: (newBankDetails: Record<string, AccountType[]>) => void;
};

export type CurrenciesSlice = {
  // TODO: enhance types by using API endpoint response later
  currencies?: any[];
  updateCurrencies: (newCurrencies: any[]) => void;
};

export type SavingsState = BankAccountsSlice & BankDetailsSlice & CurrenciesSlice;
