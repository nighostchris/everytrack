/* eslint-disable no-unused-vars */
import { ClientSettings } from '@api/everytrack_backend';

export type GlobalStateSlice = {
  username?: string;
  currencyId?: string;
  updateUsername: (newUsername: string) => void;
  updateCurrencyId: (newCurrencyId: string) => void;
  updateClientSettings: (params: ClientSettings) => void;
};

export type GlobalState = GlobalStateSlice;
