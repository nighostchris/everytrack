import BigNumber from 'bignumber.js';

import { calculateDisplayAmount } from './calculate_display_amount';
import { type Cash, type Stock, type Account, type AccountStockHolding, type ExchangeRate } from '@api/everytrack_backend';

export function calculateTotalAssetValue(
  currencyId: string,
  cash: Cash[],
  bankAccounts: Account[],
  brokerAccounts: Account[],
  exchangeRates: ExchangeRate[],
  stocksMap: Map<string, Stock>,
  stockHoldings: AccountStockHolding[],
) {
  let lockedFund = new BigNumber(0);
  let cashHoldings = new BigNumber(0);
  let instantAccessibleBalance = new BigNumber(0);

  // Add up all cash holdings
  cash.forEach(({ amount, currencyId: cashCurrencyId }) => {
    cashHoldings = cashHoldings.plus(calculateDisplayAmount(amount, currencyId, cashCurrencyId, exchangeRates));
  });

  // Add all bank account balances to instant accessible balance
  bankAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
    instantAccessibleBalance = instantAccessibleBalance.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
  });

  // Add all broker account balances to instant accessible balance
  brokerAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
    instantAccessibleBalance = instantAccessibleBalance.plus(calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates));
  });

  // Add all stock holding balances to locked fund
  stockHoldings.forEach(({ holdings }) => {
    holdings.forEach(({ unit, stockId }) => {
      const { currentPrice, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
      const holdingBalance = new BigNumber(currentPrice).multipliedBy(unit);
      lockedFund = lockedFund.plus(calculateDisplayAmount(holdingBalance.toString(), currencyId, stockCurrencyId, exchangeRates));
    });
  });

  return { lockedFund, cashHoldings, instantAccessibleBalance };
}
