import BigNumber from 'bignumber.js';

import { calculateDisplayAmount } from '@utils';
import { BrokerAccountMetrics } from '../hooks/use_brokers_state';
import { Account, Stock, StockHolding, AccountStockHolding, ExchangeRate } from '@api/everytrack_backend';

export function calculateBrokerAccountMetrics(
  currencyId: string,
  brokerAccounts: Account[],
  exchangeRates: ExchangeRate[],
  stockHoldings: AccountStockHolding[],
  stocksMap: Map<string, Stock>,
) {
  // Generate the result map
  const brokerAccountMetricsMap = new Map<string, BrokerAccountMetrics>();

  // Generate a account stock holding map
  const stockHoldingsMap = new Map<string, StockHolding[]>();
  stockHoldings.forEach(({ accountId, holdings }) => {
    stockHoldingsMap.set(accountId, holdings);
  });

  // Calculate broker account balance
  brokerAccounts.forEach(({ id, balance, assetProviderId, currencyId: accountCurrencyId }) => {
    let totalBalance = new BigNumber(0);
    let totalReturns = new BigNumber(0);
    const holdings = stockHoldingsMap.get(id) ?? [];

    // Add up the cash holding in this account
    totalBalance = totalBalance.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));

    // Calculate total balance of stock holdings in this account
    holdings.forEach(({ unit, cost, stockId }) => {
      const { currentPrice, currencyId: stockCurrencyId } = stocksMap.get(stockId)!;
      totalBalance = totalBalance.plus(
        calculateDisplayAmount(new BigNumber(currentPrice).multipliedBy(unit).toString(), currencyId, stockCurrencyId, exchangeRates),
      );
      totalReturns = totalReturns.plus(
        calculateDisplayAmount(new BigNumber(currentPrice).minus(cost).toString(), currencyId, stockCurrencyId, exchangeRates).multipliedBy(
          unit,
        ),
      );
    });

    const originalBrokerMetrics = brokerAccountMetricsMap.get(assetProviderId);
    brokerAccountMetricsMap.set(assetProviderId, {
      totalBalance: originalBrokerMetrics ? totalBalance.plus(originalBrokerMetrics.totalBalance).toFixed(2) : totalBalance.toFixed(2),
      totalReturns: originalBrokerMetrics ? totalReturns.plus(originalBrokerMetrics.totalReturns).toFixed(2) : totalReturns.toFixed(2),
    });
  });

  return brokerAccountMetricsMap;
}
