/* eslint-disable no-unused-vars */
import { ClientSettings } from '@api/everytrack_backend';

export type GlobalStateSlice = {
  username?: string;
  currencyId?: string;
  openTransferBetweenAccountModal: boolean;
  updateUsername: (newUsername: string) => void;
  updateCurrencyId: (newCurrencyId: string) => void;
  updateClientSettings: (params: ClientSettings) => void;
  updateOpenTransferBetweenAccountModal: (newModalState: boolean) => void;
};

export type GlobalState = GlobalStateSlice;
