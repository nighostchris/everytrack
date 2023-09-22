/* eslint-disable no-unused-vars */
import { Account, AccountStockHolding, Provider, Stock } from '@api/everytrack_backend';

export type BrokersPageStateSlice = {
  brokerAccounts?: Account[];
  brokerDetails?: Provider[];
  updateBrokerDetails: (newBrokerDetails: Provider[]) => void;
  updateBrokerAccounts: (newBrokerAccounts: Account[]) => void;
};

export type ModalStateSlice = {
  unit?: string;
  cost?: string;
  stockId?: string;
  accountId?: string;
  accountStockId?: string;
  assetProviderId?: string;
  openAddNewBrokerModal: boolean;
  openAddNewAccountModal: boolean;
  openEditStockHoldingModal: boolean;
  openDeleteStockHoldingModal: boolean;
  openAddNewStockHoldingModal: boolean;
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
  resetEditStockHoldingModalState: () => void;
  resetAddNewStockHoldingModalState: () => void;
  resetDeleteStockHoldingModalState: () => void;
  updateOpenAddNewBrokerModal: (newModalState: boolean) => void;
  updateOpenAddNewAccountModal: (newModalState: boolean) => void;
  populateAddNewStockHoldingModalState: (accountId: string) => void;
  updateOpenEditStockHoldingModal: (newModalState: boolean) => void;
  populateAddNewAccountModalState: (assetProviderId: string) => void;
  updateOpenAddNewStockHoldingModal: (newModalState: boolean) => void;
  updateOpenDeleteStockHoldingModal: (newModalState: boolean) => void;
  populateDeleteStockHoldingModalState: ({ stockId, accountStockId }: { stockId: string; accountStockId: string }) => void;
};

export type BrokersState = BrokersPageStateSlice & ModalStateSlice;
