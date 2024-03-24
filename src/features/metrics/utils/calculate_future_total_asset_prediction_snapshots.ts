import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import {
  type Cash,
  type Stock,
  type Account,
  type ExchangeRate,
  type FuturePayment,
  type AccountStockHolding,
} from '@api/everytrack_backend';
import { calculateDisplayAmount, calculateTotalAssetValue } from '@utils';
import { type TotalAssetValueSnapshot } from '../hooks/use_metrics_state';

export function calculateFutureTotalAssetPredictionSnapshots(
  currencyId: string,
  cash: Cash[],
  bankAccounts: Account[],
  brokerAccounts: Account[],
  exchangeRates: ExchangeRate[],
  stocksMap: Map<string, Stock>,
  futurePayments: FuturePayment[],
  stockHoldings: AccountStockHolding[],
) {
  let totalAssetValue = new BigNumber(0);
  const totalAssetValueSnapshots: TotalAssetValueSnapshot[] = [];

  // Calculate current total asset value
  const { lockedFund, cashHoldings, instantAccessibleBalance } = calculateTotalAssetValue(
    currencyId,
    cash,
    bankAccounts,
    brokerAccounts,
    exchangeRates,
    stocksMap,
    stockHoldings,
  );
  totalAssetValue = totalAssetValue.plus(lockedFund).plus(cashHoldings).plus(instantAccessibleBalance);

  // Create a future payment map for calculating total asset value for the next year
  const futurePaymentsMap: Map<
    string,
    | {
        amount: string;
        income: boolean;
        rolling: boolean;
        frequency: number;
        currencyId: string;
      }[]
    | undefined
  > = new Map();
  futurePayments.forEach(({ frequency, scheduledAt, amount, currencyId, rolling, income }) => {
    const formattedScheduledAt = dayjs.unix(scheduledAt).format('YYYY-MM-DD');
    const newRecord = { amount, frequency: frequency === null ? 0 : frequency, currencyId, rolling, income };
    if (futurePaymentsMap.has(formattedScheduledAt)) {
      futurePaymentsMap.set(formattedScheduledAt, [...futurePaymentsMap.get(formattedScheduledAt)!, newRecord]);
    } else {
      futurePaymentsMap.set(formattedScheduledAt, [newRecord]);
    }
  });

  // Populate totalAssetValueSnapshots array by adding in future payments to accumulated future total asset value
  const todayInUnix = dayjs().startOf('day').unix();
  const oneYearFromTodayInUnix = dayjs().startOf('day').add(12, 'months').unix();
  for (let date = todayInUnix; date <= oneYearFromTodayInUnix; date = dayjs.unix(date).add(1, 'day').startOf('day').unix()) {
    const formattedDate = dayjs.unix(date).format('YYYY-MM-DD');
    const futurePayments = futurePaymentsMap.get(formattedDate);
    if (futurePayments) {
      futurePayments.forEach(({ amount, frequency, currencyId: futurePaymentCurrencyId, rolling, income }) => {
        const absoluteAmountToAdd = calculateDisplayAmount(amount, currencyId, futurePaymentCurrencyId, exchangeRates);
        const amountToAdd = income ? absoluteAmountToAdd : absoluteAmountToAdd.negated();
        totalAssetValue = totalAssetValue.plus(amountToAdd);
        if (rolling) {
          const newScheduledPaymentDate = dayjs.unix(date).add(frequency, 'seconds').startOf('day').format('YYYY-MM-DD');
          const newRecord = { amount, frequency, currencyId: futurePaymentCurrencyId, rolling, income };
          if (futurePaymentsMap.has(newScheduledPaymentDate)) {
            futurePaymentsMap.set(newScheduledPaymentDate, [...futurePaymentsMap.get(newScheduledPaymentDate)!, newRecord]);
          } else {
            futurePaymentsMap.set(newScheduledPaymentDate, [newRecord]);
          }
        }
      });
      futurePaymentsMap.set(formattedDate, undefined);
    }
    totalAssetValueSnapshots.push({
      x: new Date(date * 1000),
      y: Number(totalAssetValue.toFixed(0)),
    });
  }

  return totalAssetValueSnapshots;
}
