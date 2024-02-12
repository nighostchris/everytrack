/* eslint-disable no-unused-vars */

export type ModalStateSlice = {
  unit?: string;
  cost?: string;
  balance?: string;
  stockId?: string;
  accountId?: string;
  currencyId?: string;
  accountTypeId?: string;
  accountStockId?: string;
  assetProviderId?: string;
  openAddNewBrokerModal: boolean;
  openAddNewAccountModal: boolean;
  openDeleteAccountModal: boolean;
  openEditCashHoldingModal: boolean;
  openEditStockHoldingModal: boolean;
  openDeleteStockHoldingModal: boolean;
  openAddNewStockHoldingModal: boolean;
  populateEditCashHoldingModalState: ({
    balance,
    currencyId,
    accountTypeId,
  }: {
    balance: string;
    currencyId: string;
    accountTypeId: string;
  }) => void;
  populateEditStockHoldingModalState: ({
    unit,
    cost,
    stockId,
    accountId,
  }: {
    unit: string;
    cost: string;
    stockId: string;
    accountId: string;
  }) => void;
  resetAddNewAccountModalState: () => void;
  resetDeleteAccountModalState: () => void;
  resetEditCashHoldingModalState: () => void;
  resetEditStockHoldingModalState: () => void;
  resetAddNewStockHoldingModalState: () => void;
  resetDeleteStockHoldingModalState: () => void;
  populateDeleteAccountModalState: (accountId: string) => void;
  updateOpenAddNewBrokerModal: (newModalState: boolean) => void;
  updateOpenAddNewAccountModal: (newModalState: boolean) => void;
  updateOpenDeleteAccountModal: (newModalState: boolean) => void;
  populateAddNewStockHoldingModalState: (accountId: string) => void;
  updateOpenEditStockHoldingModal: (newModalState: boolean) => void;
  populateAddNewAccountModalState: (assetProviderId: string) => void;
  updateOpenAddNewStockHoldingModal: (newModalState: boolean) => void;
  updateOpenDeleteStockHoldingModal: (newModalState: boolean) => void;
  updateOpenEditCashHoldingModalState: (newModalState: boolean) => void;
  populateDeleteStockHoldingModalState: ({ stockId, accountStockId }: { stockId: string; accountStockId: string }) => void;
};

export type BrokersState = ModalStateSlice;
