/* eslint-disable no-unused-vars */
import { Currency, ClientSettings } from '@api/everytrack_backend';

export type GlobalStateSlice = {
  username?: string;
  currencyId?: string;
  currencies?: Currency[];
  updateUsername: (newUsername: string) => void;
  updateCurrencyId: (newCurrencyId: string) => void;
  updateCurrencies: (newCurrencies: Currency[]) => void;
  updateClientSettings: (params: ClientSettings) => void;
};

export type GlobalState = GlobalStateSlice;
