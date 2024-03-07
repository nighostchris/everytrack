import dayjs from 'dayjs';

import { Currency, FuturePayment } from '@api/everytrack_backend';
import { PaymentsCalendarEvent } from '../hooks/use_payments_state';

export function generatePaymentsCalendarEvents(futurePayments: FuturePayment[], currencies: Currency[]): PaymentsCalendarEvent[] {
  if (currencies.length === 0 || futurePayments.length === 0) {
    return [];
  }
  // Generate a currency map
  const currenciesMap = new Map<string, string>();
  currencies.forEach(({ id, symbol }) => currenciesMap.set(id, symbol));

  // Generate events
  return futurePayments.map(({ id, name: title, income, amount, currencyId, rolling, frequency, scheduledAt }) => ({
    id,
    title,
    amount,
    income,
    rolling,
    symbol: currenciesMap.get(currencyId)!,
    frequency: `Every ${dayjs.duration({ seconds: frequency }).humanize().replaceAll('1 ', '').replaceAll('a ', '')}`,
    start: dayjs.unix(scheduledAt).toDate(),
    end: dayjs.unix(scheduledAt).toDate(),
    allDay: true,
  }));
}
