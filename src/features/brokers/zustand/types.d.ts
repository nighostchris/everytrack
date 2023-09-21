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
  openAddNewBrokerModal: boolean;
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
  resetEditStockHoldingModalState: () => void;
  resetAddNewStockHoldingModalState: () => void;
  resetDeleteStockHoldingModalState: () => void;
  updateOpenAddNewBrokerModal: (newModalState: boolean) => void;
  populateAddNewStockHoldingModalState: (accountId: string) => void;
  updateOpenEditStockHoldingModal: (newModalState: boolean) => void;
  updateOpenAddNewStockHoldingModal: (newModalState: boolean) => void;
  updateOpenDeleteStockHoldingModal: (newModalState: boolean) => void;
  populateDeleteStockHoldingModalState: ({ stockId, accountStockId }: { stockId: string; accountStockId: string }) => void;
};

export type BrokersState = BrokersPageStateSlice & ModalStateSlice;
