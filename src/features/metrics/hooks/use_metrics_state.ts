import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import { calculateDisplayAmount } from '@utils';
import { Stock } from '@api/everytrack_backend';
import { store as globalStore } from '@lib/zustand';
import { useCash, useStocks, useBankAccounts, useExchangeRates, useStockHoldings, useBrokerAccounts, useFuturePayments } from '@hooks';

export interface TotalAssetValueSnapshot {
  x: Date;
  y: number;
}

export const useMetricsState = () => {
  const { currencyId } = globalStore();

  const { cash, error: fetchCashError } = useCash();
  const { stocksMap, error: fetchStocksError } = useStocks();
  const { bankAccounts, error: fetchBankAccountsError } = useBankAccounts();
  const { stockHoldings, error: fetchStockHoldingsError } = useStockHoldings();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();
  const { futurePayments, error: fetchFuturePaymentsError } = useFuturePayments();
  const { brokerAccounts, error: fetchBrokerAccountsError } = useBrokerAccounts();

  const error = React.useMemo(
    () =>
      fetchCashError?.message ??
      fetchStocksError?.message ??
      fetchBankAccountsError?.message ??
      fetchStockHoldingsError?.message ??
      fetchExchangeRatesError?.message ??
      fetchFuturePaymentsError?.message ??
      fetchBrokerAccountsError?.message,
    [
      fetchCashError,
      fetchStocksError,
      fetchBankAccountsError,
      fetchStockHoldingsError,
      fetchExchangeRatesError,
      fetchFuturePaymentsError,
      fetchBrokerAccountsError,
    ],
  );

  const { snapshotMin, snapshotMax, totalAssetValueSnapshots } = React.useMemo(() => {
    let totalAssetValue = new BigNumber(0);
    let max: BigNumber = new BigNumber(-1);
    let min: BigNumber = new BigNumber(totalAssetValue);
    const totalAssetValueSnapshots: TotalAssetValueSnapshot[] = [];
    if (cash && bankAccounts && brokerAccounts && stockHoldings && exchangeRates && futurePayments && currencyId) {
      // Add all cash holdings to total asset value
      cash.forEach(({ amount, currencyId: cashCurrencyId }) => {
        totalAssetValue = totalAssetValue.plus(calculateDisplayAmount(amount, currencyId, cashCurrencyId, exchangeRates));
      });
      // Add all bank account balances to total asset value
      bankAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        totalAssetValue = totalAssetValue.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
      });
      // Add all broker account balances to total asset value
      brokerAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        totalAssetValue = totalAssetValue.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
      });
      // Add all stock holding balances to total asset value
      stockHoldings.forEach(({ holdings }) => {
        holdings.forEach(({ unit, stockId }) => {
          const { currentPrice, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
          const holdingBalance = new BigNumber(currentPrice).multipliedBy(unit);
          totalAssetValue = totalAssetValue.plus(
            calculateDisplayAmount(holdingBalance.toString(), currencyId, stockCurrencyId, exchangeRates),
          );
        });
      });
      // Create a future payment map for calculating total asset value for the next year
      const futurePaymentsMap: Map<
        number,
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
        const newRecord = { amount, frequency: frequency === null ? 0 : frequency, currencyId, rolling, income };
        if (futurePaymentsMap.has(scheduledAt)) {
          futurePaymentsMap.set(scheduledAt, [...futurePaymentsMap.get(scheduledAt)!, newRecord]);
        } else {
          futurePaymentsMap.set(scheduledAt, [newRecord]);
        }
      });
      const todayInUnix = dayjs().startOf('day').unix();
      const oneYearFromTodayInUnix = dayjs().startOf('day').add(6, 'months').unix();
      for (let date = todayInUnix; date <= oneYearFromTodayInUnix; date = dayjs.unix(date).add(1, 'day').unix()) {
        max = totalAssetValue.isGreaterThan(max) ? totalAssetValue : max;
        const futurePayments = futurePaymentsMap.get(date);
        if (futurePayments) {
          futurePayments.forEach(({ amount, frequency, currencyId: futurePaymentCurrencyId, rolling, income }) => {
            const absoluteAmountToAdd = calculateDisplayAmount(amount, currencyId, futurePaymentCurrencyId, exchangeRates);
            const amountToAdd = income ? absoluteAmountToAdd : absoluteAmountToAdd.negated();
            totalAssetValue = totalAssetValue.plus(amountToAdd);
            if (rolling) {
              const newScheduledPaymentDate = dayjs.unix(date).add(frequency, 'seconds').startOf('day').unix();
              const newRecord = { amount, frequency, currencyId: futurePaymentCurrencyId, rolling, income };
              if (futurePaymentsMap.has(newScheduledPaymentDate)) {
                futurePaymentsMap.set(newScheduledPaymentDate, [...futurePaymentsMap.get(newScheduledPaymentDate)!, newRecord]);
              } else {
                futurePaymentsMap.set(newScheduledPaymentDate, [newRecord]);
              }
            }
          });
          futurePaymentsMap.set(date, undefined);
        }
        totalAssetValueSnapshots.push({
          x: new Date(date * 1000),
          y: Number(totalAssetValue.toFixed(0)),
        });
      }
      const quarterAreaPortion = max.minus(min).dividedBy(4).abs();
      min = min.minus(quarterAreaPortion);
      max = max.plus(quarterAreaPortion);
    }
    return { totalAssetValueSnapshots, snapshotMin: min.toFixed(0), snapshotMax: max.toFixed(0) };
  }, [cash, currencyId, bankAccounts, brokerAccounts, stockHoldings, exchangeRates, futurePayments]);

  return { error, futureTotalAssetPredictionGraphData: { snapshotMin, snapshotMax, totalAssetValueSnapshots } };
};

export default useMetricsState;
