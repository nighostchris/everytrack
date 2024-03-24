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
  category: string;
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
  const { futurePayments, error: fetchFuturePaymentsError } = useFuturePayments();
  const { currencies, currenciesMap, error: fetchCurrenciesError } = useCurrencies();

  const error = React.useMemo(
    () => fetchCurrenciesError?.message ?? fetchFuturePaymentsError?.message,
    [fetchCurrenciesError, fetchFuturePaymentsError],
  );

  const paymentsTableRows = React.useMemo(() => {
    const result: PaymentsTableRow[] = [];
    if (futurePayments && currencies) {
      futurePayments.forEach(({ id, name, amount, income, rolling, remarks, category, frequency, accountId, currencyId, scheduledAt }) => {
        const displayCurrency = currenciesMap.get(currencyId)!.symbol;
        result.push({
          id,
          name,
          amount,
          income,
          remarks,
          rolling,
          category,
          accountId,
          currencyId,
          frequency: frequency === null ? 0 : frequency,
          scheduledDate: dayjs.unix(scheduledAt).format('MMM DD, YYYY'),
          displayAmount: `${displayCurrency} ${new BigNumber(amount).toFormat(2)}`,
        });
      });
    }
    return result.sort((a, b) => (dayjs(a.scheduledDate).isAfter(dayjs(b.scheduledDate)) ? 1 : -1));
  }, [currencies, futurePayments]);

  const paymentCalendarEvents = React.useMemo(
    () => generatePaymentsCalendarEvents(futurePayments || [], currencies || []),
    [currencies, futurePayments],
  );

  return { error, paymentsTableRows, paymentCalendarEvents };
};

export default usePaymentsState;
