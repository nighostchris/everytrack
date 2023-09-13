/* eslint-disable no-unused-vars */
import { Currency, ClientSettings, ExchangeRate } from '@api/everytrack_backend';

export type GlobalStateSlice = {
  username?: string;
  currencyId?: string;
  currencies?: Currency[];
  exchangeRates?: ExchangeRate[];
  updateUsername: (newUsername: string) => void;
  updateCurrencyId: (newCurrencyId: string) => void;
  updateCurrencies: (newCurrencies: Currency[]) => void;
  updateClientSettings: (params: ClientSettings) => void;
  updateExchangeRates: (newExchangeRates: ExchangeRate[]) => void;
};

export type GlobalState = GlobalStateSlice;
