import { Broker, BrokerAccount, BrokerAccountHolding } from '../hooks/use_brokers_state';
import { Account, Currency, Provider, Stock, StockHolding, AccountStockHolding } from '@api/everytrack_backend';

export function generateBrokerDetails(
  brokerDetails: Provider[],
  brokerAccounts: Account[],
  stockHoldings: AccountStockHolding[],
  stocksMap: Map<string, Stock>,
  currenciesMap: Map<string, Currency>,
) {
  // Generate a account stock holding map
  const stockHoldingsMap = new Map<string, StockHolding[]>();
  stockHoldings.forEach(({ accountId, holdings }) => {
    stockHoldingsMap.set(accountId, holdings);
  });

  // Generate a broker map
  const brokersMap = new Map<string, Broker>();
  brokerDetails.forEach(({ id, name, icon }) => brokersMap.set(id, { id, name, icon, accounts: [] }));

  // Populate broker map
  brokerAccounts.forEach(({ id: accountId, name, balance, currencyId: accountCurrencyId, assetProviderId, accountTypeId }) => {
    const holdings = stockHoldingsMap.get(accountId) ?? [];

    // Get all stock holdings of an account
    const brokerAccountHoldings: BrokerAccountHolding[] = holdings.map(({ id, unit, cost, stockId }) => {
      const { name, ticker, currentPrice, currencyId } = stocksMap.get(stockId)!;
      const { symbol } = currenciesMap.get(currencyId)!;
      return { id, unit, cost, name, ticker, stockId, currentPrice, currency: { id: currencyId, symbol } };
    });

    // Construct the account
    const accountBalanceCurrency = currenciesMap.get(accountCurrencyId)!;
    const brokerAccount: BrokerAccount = {
      name,
      balance,
      id: accountId,
      accountTypeId,
      currency: accountBalanceCurrency,
      holdings: brokerAccountHoldings.sort((a, b) => (a.name > b.name ? 1 : -1)),
    };

    // Update broker by adding the new account detected under specific asset provider
    const broker = brokersMap.get(assetProviderId)!;
    brokersMap.set(assetProviderId, {
      ...broker,
      accounts: [...broker.accounts, brokerAccount],
    });
  });

  // Extract all entries in brokersMap into result
  return Array.from(brokersMap.values())
    .filter(({ accounts }) => accounts.length > 0)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
}
