/* eslint-disable no-unused-vars */

export type ModalStateSlice = {
  amount?: string;
  cashId?: string;
  balance?: string;
  accountId?: string;
  currencyId?: string;
  accountTypeId?: string;
  assetProviderId?: string;
  openEditCashModal: boolean;
  openAddNewCashModal: boolean;
  openDeleteCashModal: boolean;
  openAddNewAccountModal: boolean;
  openDeleteAccountModal: boolean;
  openAddNewProviderModal: boolean;
  openEditAccountBalanceModal: boolean;
  openTransferBetweenAccountModal: boolean;
  populateEditAccountBalanceModalState: ({
    balance,
    currencyId,
    accountTypeId,
  }: {
    balance: string;
    currencyId: string;
    accountTypeId: string;
  }) => void;
  resetEditCashModalState: () => void;
  resetDeleteCashModalState: () => void;
  resetAddNewAccountModalState: () => void;
  resetDeleteAccountModalState: () => void;
  resetEditAccountBalanceModalState: () => void;
  populateDeleteCashModalState: (cashId: string) => void;
  updateOpenEditCashModal: (newModalState: boolean) => void;
  updateOpenAddNewCashModal: (newModalState: boolean) => void;
  updateOpenDeleteCashModal: (newModalState: boolean) => void;
  populateDeleteAccountModalState: (accountId: string) => void;
  updateOpenDeleteAccountModal: (newModalState: boolean) => void;
  updateOpenAddNewAccountModal: (newModalState: boolean) => void;
  updateOpenAddNewProviderModal: (newModalState: boolean) => void;
  populateAddNewAccountModalState: (assetProviderId: string) => void;
  updateOpenEditAccountBalanceModal: (newModalState: boolean) => void;
  updateOpenTransferBetweenAccountModal: (newModalState: boolean) => void;
  populateEditCashModalState: ({ id, amount, currencyId }: { id: string; amount: string; currencyId: string }) => void;
};

export type SavingsState = ModalStateSlice;
