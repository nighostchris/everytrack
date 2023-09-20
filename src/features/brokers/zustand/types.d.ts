/* eslint-disable no-unused-vars */
import { Account, AccountStockHolding, Provider, Stock } from '@api/everytrack_backend';

export type AddNewStockHoldingModalStateSlice = {
  accountId?: string;
  updateAccountId: (newAccountId: string) => void;
};

export type BrokersPageStateSlice = {
  brokerAccounts?: Account[];
  brokerDetails?: Provider[];
  updateBrokerDetails: (newBrokerDetails: Provider[]) => void;
  updateBrokerAccounts: (newBrokerAccounts: Account[]) => void;
};

export type DeleteStockHoldingModalStateSlice = {
  accountStockId?: string;
  resetDeleteStockHoldingModalState: () => void;
  updateAccountStockId: (newAccountStockId: string) => void;
};

export type EditStockHoldingModalStateSlice = {
  unit?: string;
  cost?: string;
  stockId?: string;
  updateUnit: (newUnit: string) => void;
  updateCost: (newCost: string) => void;
  updateStockId: (newStockId: string) => void;
};

export type ModalStateSlice = {
  openAddNewBrokerModal: boolean;
  openEditStockHoldingModal: boolean;
  openDeleteStockHoldingModal: boolean;
  openAddNewStockHoldingModal: boolean;
  updateOpenAddNewBrokerModal: (newModalState: boolean) => void;
  updateOpenEditStockHoldingModal: (newModalState: boolean) => void;
  updateOpenAddNewStockHoldingModal: (newModalState: boolean) => void;
  updateOpenDeleteStockHoldingModal: (newModalState: boolean) => void;
};

export type BrokersState = AddNewStockHoldingModalStateSlice &
  BrokersPageStateSlice &
  DeleteStockHoldingModalStateSlice &
  EditStockHoldingModalStateSlice &
  ModalStateSlice;
