import { store } from '@lib/zustand';
import { useCurrencies } from './use_currencies';

interface DisplayCurrency {
  symbol: string;
  error?: string;
}

export const useDisplayCurrency = (): DisplayCurrency => {
  const { currencies, error } = useCurrencies();
  const { currencyId } = store();
  if (error) {
    return { symbol: '', error: error.message };
  }
  const filteredCurrency = (currencies ?? []).filter(({ id }) => id === currencyId);
  if (filteredCurrency.length === 0) {
    return { symbol: '', error: 'Invalid currency' };
  }
  return { symbol: filteredCurrency[0].symbol };
};
