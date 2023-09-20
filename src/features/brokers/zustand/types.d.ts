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

export type ModalStateSlice = {
  openAddNewBrokerModal: boolean;
  openAddNewStockHoldingModal: boolean;
  updateOpenAddNewBrokerModal: (newModalState: boolean) => void;
  updateOpenAddNewStockHoldingModal: (newModalState: boolean) => void;
};

export type BrokersState = AddNewStockHoldingModalStateSlice & BrokersPageStateSlice & ModalStateSlice;
