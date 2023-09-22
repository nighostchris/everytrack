/* eslint-disable no-unused-vars */
import { Account, Provider } from '@api/everytrack_backend';

export type SavingsPageStateSlice = {
  bankDetails?: Provider[];
  updateBankDetails: (newBankDetails: Provider[]) => void;
};

export type ModalStateSlice = {
  balance?: string;
  accountId?: string;
  currencyId?: string;
  accountTypeId?: string;
  assetProviderId?: string;
  openAddNewAccountModal: boolean;
  openDeleteAccountModal: boolean;
  openAddNewProviderModal: boolean;
  openEditAccountBalanceModal: boolean;
  populateEditAccountBalanceModalState: ({
    balance,
    currencyId,
    accountTypeId,
  }: {
    balance: string;
    currencyId: string;
    accountTypeId: string;
  }) => void;
  resetAddNewAccountModalState: () => void;
  resetDeleteAccountModalState: () => void;
  resetEditAccountBalanceModalState: () => void;
  populateDeleteAccountModalState: (accountId: string) => void;
  updateOpenDeleteAccountModal: (newModalState: boolean) => void;
  updateOpenAddNewAccountModal: (newModalState: boolean) => void;
  updateOpenAddNewProviderModal: (newModalState: boolean) => void;
  populateAddNewAccountModalState: (assetProviderId: string) => void;
  updateOpenEditAccountBalanceModal: (newModalState: boolean) => void;
};

export type SavingsState = SavingsPageStateSlice & ModalStateSlice;
