/* eslint-disable no-unused-vars */
import { Account, Provider } from '@api/everytrack_backend';

export type BrokerAccountsSlice = {
  brokerAccounts?: Account[];
  updateBrokerAccounts: (newBrokerAccounts: Account[]) => void;
};

export type BrokerDetailsSlice = {
  brokerDetails?: Provider[];
  updateBrokerDetails: (newBrokerDetails: Provider[]) => void;
};

export type ModalStateSlice = {
  openAddNewBrokerModal: boolean;
  updateOpenAddNewBrokerModal: (newModalState: boolean) => void;
};

export type BrokersState = BrokerAccountsSlice & BrokerDetailsSlice & ModalStateSlice;
