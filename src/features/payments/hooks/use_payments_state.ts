import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { Event } from 'react-big-calendar';

import type { Currency } from '@api/everytrack_backend';
import { generatePaymentsCalendarEvents } from '../utils';
import { useCurrencies, useFuturePayments } from '@hooks';

export interface PaymentsTableRow {
  id: string;
  name: string;
  amount: string;
  remarks: string;
  income: boolean;
  rolling: boolean;
  frequency: number;
  accountId: string;
  currencyId: string;
  scheduledDate: string;
  displayAmount: string;
}

export interface PaymentsCalendarEvent extends Event {
  id: string;
  symbol: string;
  amount: string;
  income: boolean;
  rolling: boolean;
  frequency: string;
}

export const usePaymentsState = () => {
  const { currencies, error: fetchCurrenciesError } = useCurrencies();
  const { futurePayments, error: fetchFuturePaymentsError } = useFuturePayments();

  const error = React.useMemo(
    () => fetchCurrenciesError?.message ?? fetchFuturePaymentsError?.message,
    [fetchCurrenciesError, fetchFuturePaymentsError],
  );

  const paymentsTableRows = React.useMemo(() => {
    const result: PaymentsTableRow[] = [];
    const currenciesMap = new Map<string, Currency>();
    if (futurePayments && currencies) {
      // Generate a currency map
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      futurePayments.forEach(({ id, name, amount, income, rolling, remarks, frequency, accountId, currencyId, scheduledAt }) => {
        const displayCurrency = currenciesMap.get(currencyId)!.symbol;
        result.push({
          id,
          name,
          amount,
          income,
          remarks,
          rolling,
          frequency,
          accountId,
          currencyId,
          scheduledDate: dayjs.unix(scheduledAt).format('MMM DD, YYYY'),
          displayAmount: `${displayCurrency} ${new BigNumber(amount).toFormat(2)}`,
        });
      });
    }
    return result.sort((a, b) => (dayjs(a.scheduledDate).isAfter(dayjs(b.scheduledDate)) ? 1 : -1));
  }, [futurePayments, currencies]);

  const paymentCalendarEvents = React.useMemo(
    () => generatePaymentsCalendarEvents(futurePayments || [], currencies || []),
    [currencies, futurePayments],
  );

  return { error, paymentsTableRows, paymentCalendarEvents };
};

export default usePaymentsState;
