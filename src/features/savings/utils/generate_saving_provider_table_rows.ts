import BigNumber from 'bignumber.js';

import { SavingProviderTableRow } from '../hooks/use_savings_state';
import { Account, Currency, ExchangeRate, Provider } from '@api/everytrack_backend';
import { calculateDisplayAmount } from '@utils';

export function generateSavingProviderTableRows(
  currencyId: string,
  bankAccounts: Account[],
  bankDetails: Provider[],
  exchangeRates: ExchangeRate[],
  currenciesMap: Map<string, Currency>,
) {
  const result: SavingProviderTableRow[] = [];
  const bankDetailsMap = new Map<string, SavingProviderTableRow>();

  // Generate a bank detail map
  bankDetails.forEach(({ id, name, icon }) =>
    bankDetailsMap.set(id, { id, name, icon, balance: new BigNumber(0).toFormat(2), accounts: [] }),
  );

  // Populate the bank detail map with bank accounts data
  bankAccounts.forEach(({ id, name, balance, currencyId, accountTypeId, assetProviderId }) => {
    const savingProviderTableRow = bankDetailsMap.get(assetProviderId) as SavingProviderTableRow;
    bankDetailsMap.set(assetProviderId, {
      ...savingProviderTableRow,
      accounts: [
        ...savingProviderTableRow.accounts,
        { id, name, balance, accountTypeId, currency: { id: currencyId, symbol: currenciesMap.get(currencyId)!.symbol } },
      ].sort((a, b) => (a.name > b.name ? 1 : -1)),
    });
  });

  // Extract all entries in bankDetailsMap into result array
  Array.from(bankDetailsMap.values()).forEach((savingProviderTableRow) => {
    if (savingProviderTableRow.accounts.length > 0) {
      const balance = savingProviderTableRow.accounts
        .reduce(
          (acc, { balance, currency: { id: sourceCurrencyId } }) =>
            (acc = acc.plus(calculateDisplayAmount(balance, currencyId, sourceCurrencyId, exchangeRates))),
          new BigNumber(0),
        )
        .toFormat(2);
      result.push({ ...savingProviderTableRow, balance });
    }
  });

  return result.sort((a, b) => (a.name > b.name ? 1 : -1));
}
