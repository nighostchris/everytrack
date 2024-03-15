import React from 'react';
import BigNumber from 'bignumber.js';
import { Control, FieldErrors } from 'react-hook-form';

import { TRANSACTION_CATEGORIES } from '@consts';
import { HookedSelect, SelectOption } from '@components';
import { Account, Currency, TransactionCategory } from '@api/everytrack_backend';

interface AddNewTransactionModalSecondStageProps {
  control: Control<any, any>;
  errors: FieldErrors<{ currencyId: string; accountId: string; category: TransactionCategory }>;
  currencies?: Currency[];
  bankAccounts?: Account[];
}

export const AddNewTransactionModalSecondStage: React.FC<AddNewTransactionModalSecondStageProps> = ({
  errors,
  control,
  currencies,
  bankAccounts,
}) => {
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );
  const bankOptions: SelectOption[] = React.useMemo(() => {
    if (bankAccounts && currencies) {
      const currenciesMap = new Map<string, Currency>();
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      return bankAccounts.map(({ id, name, balance, currencyId }) => {
        const currency = (currenciesMap.get(currencyId) as Currency).symbol;
        return { value: id, display: `${name} - ${currency} ${new BigNumber(balance).toFormat(2)}` };
      });
    }
    return [];
  }, [bankAccounts]);
  const categoryOptions: SelectOption[] = TRANSACTION_CATEGORIES.map((category) => ({
    value: category,
    display: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
  })).sort((a, b) => (a.value > b.value ? 1 : -1));

  return (
    <div className="flex flex-col space-y-6 px-4 pb-6 md:px-6">
      <HookedSelect
        label="Currency"
        formId="currencyId"
        control={control as Control<any, any>}
        className="!max-w-none"
        options={currencyOptions}
        placeholder="Select currency..."
        error={errors.currencyId && errors.currencyId.message?.toString()}
      />
      <HookedSelect
        label="Related Account"
        formId="accountId"
        control={control as Control<any, any>}
        className="!max-w-none"
        options={bankOptions}
        placeholder="Select account..."
        error={errors.accountId && errors.accountId.message?.toString()}
      />
      <HookedSelect
        label="Category"
        formId="category"
        control={control as Control<any, any>}
        className="!max-w-none"
        options={categoryOptions}
        placeholder="Select category..."
        error={errors.category && errors.category.message?.toString()}
      />
    </div>
  );
};

export default AddNewTransactionModalSecondStage;
