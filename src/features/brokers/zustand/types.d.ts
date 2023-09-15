/* eslint-disable no-unused-vars */
import { Account, AccountStockHolding, Provider, Stock } from '@api/everytrack_backend';

export type AddNewStockHoldingModalStateSlice = {
  accountId?: string;
  updateAccountId: (newAccountId: string) => void;
};

export type BrokersPageStateSlice = {
  stocks?: Stock[];
  brokerAccounts?: Account[];
  brokerDetails?: Provider[];
  accountStockHoldings?: AccountStockHolding[];
  updateStocks: (newStocks: Stock[]) => void;
  updateBrokerDetails: (newBrokerDetails: Provider[]) => void;
  updateBrokerAccounts: (newBrokerAccounts: Account[]) => void;
  updateAccountStockHoldings: (newAccountStockHoldings: AccountStockHolding[]) => void;
};

export type ModalStateSlice = {
  openAddNewBrokerModal: boolean;
  openAddNewStockHoldingModal: boolean;
  updateOpenAddNewBrokerModal: (newModalState: boolean) => void;
  updateOpenAddNewStockHoldingModal: (newModalState: boolean) => void;
};

export type BrokersState = AddNewStockHoldingModalStateSlice & BrokersPageStateSlice & ModalStateSlice;
