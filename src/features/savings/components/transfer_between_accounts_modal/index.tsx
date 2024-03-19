/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { Currency, Provider, transferBetweenAccounts } from '@api/everytrack_backend';
import { Button, Dialog, Input, ComboboxGroups, HookedSingleCombobox } from '@components';
import { useCountries, useCurrencies, useBankAccounts, useBankDetails, useTransactions } from '@hooks';

const transferBetweenAccountsFormSchema = z.object({
  amount: z.string(),
  sourceAccountId: z.string(),
  targetAccountId: z.string(),
});

export const TransferBetweenAccountsModal: React.FC = () => {
  const { countries } = useCountries();
  const { currencies } = useCurrencies();
  const { bankDetails } = useBankDetails();
  const { refetch: refetchTransactions } = useTransactions();
  const { bankAccounts, refetch: refetchBankAccounts } = useBankAccounts();
  const { open, setOpen } = store(
    useShallow(({ openTransferBetweenAccountModal: open, updateOpenTransferBetweenAccountModal: setOpen }) => ({ open, setOpen })),
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof transferBetweenAccountsFormSchema>>({
    defaultValues: {
      amount: undefined,
      sourceAccountId: undefined,
      targetAccountId: undefined,
    },
    resolver: zodResolver(transferBetweenAccountsFormSchema),
  });
  const watchSourceAccountId = watch('sourceAccountId');

  const bankAccountByCountryGroups: (enableRecipients: boolean) => ComboboxGroups = React.useCallback(
    (enableRecipients) => {
      if (countries && currencies && bankDetails && bankAccounts) {
        const currenciesMap = new Map<string, Currency>();
        currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
        const bankDetailsMap = new Map<string, Provider>();
        bankDetails.forEach((bankDetail) => bankDetailsMap.set(bankDetail.id, bankDetail));
        const bankAccountToCountryIdMap = new Map<string, { countryId: string; assetProviderName: string }>();
        bankAccounts.forEach(({ id: bankAccountId, assetProviderId }) =>
          bankAccountToCountryIdMap.set(bankAccountId, {
            countryId: bankDetailsMap.get(assetProviderId)!.countryId,
            assetProviderName: bankDetailsMap.get(assetProviderId)!.name,
          }),
        );
        return countries.reduce((acc, { id, code }) => {
          const originalGroups = { ...acc };
          const potentialNewGroupItems = bankAccounts
            .filter(
              ({ id: bankAccountId, balance }) =>
                (enableRecipients ? bankAccountId !== watchSourceAccountId : true) &&
                (enableRecipients ? true : new BigNumber(balance).isGreaterThan(0)) &&
                id === bankAccountToCountryIdMap.get(bankAccountId)!.countryId,
            )
            .map(({ id: bankAccountId, name, balance, currencyId }) => ({
              value: bankAccountId,
              display: `${bankAccountToCountryIdMap.get(bankAccountId)!.assetProviderName}(${name}) - ${currenciesMap.get(currencyId)!.symbol}${balance}`,
            }))
            .sort((a, b) => (a.display > b.display ? 1 : -1));
          return potentialNewGroupItems.length > 0 ? { ...acc, [code]: potentialNewGroupItems } : originalGroups;
        }, {});
      }
      return {};
    },
    [countries, currencies, bankDetails, bankAccounts, watchSourceAccountId],
  );

  const onSubmitTransferBetweenAccountsForm = async (data: any) => {
    setIsLoading(true);
    const { amount, sourceAccountId, targetAccountId } = data as z.infer<typeof transferBetweenAccountsFormSchema>;
    try {
      const { success } = await transferBetweenAccounts({ amount, sourceAccountId, targetAccountId });
      if (success) {
        setOpen(false);
        refetchBankAccounts();
        refetchTransactions();
      }
      setIsLoading(false);
      toast.info('Success!');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open} className="md:max-w-sm">
      <div className="rounded-t-md bg-white px-4 pb-6 pt-5 md:px-6 md:py-6">
        <h3 className="text-lg font-medium text-gray-900">Transfer Between Accounts</h3>
        <HookedSingleCombobox
          label="Source Account"
          formId="sourceAccountId"
          groups={bankAccountByCountryGroups(false)}
          placeholder="Select source account..."
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          error={errors.sourceAccountId && errors.sourceAccountId.message?.toString()}
        />
        {watchSourceAccountId && (
          <>
            <HookedSingleCombobox
              label="Target Account"
              formId="targetAccountId"
              groups={bankAccountByCountryGroups(true)}
              placeholder="Select target account..."
              control={control as Control<any, any>}
              className="mt-4 !max-w-none"
              error={errors.targetAccountId && errors.targetAccountId.message?.toString()}
            />
            <Input
              label="Amount"
              formId="amount"
              register={register}
              error={errors.amount && errors.amount.message?.toString()}
              className="mt-4 !max-w-none"
            />
          </>
        )}
      </div>
      <div className="flex flex-col space-y-2 rounded-b-md bg-gray-50 px-4 py-5 md:flex-row-reverse md:space-y-0 md:px-6 md:py-3">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitTransferBetweenAccountsForm)}
          className="w-full md:ml-2 md:w-fit"
        >
          Transfer
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="w-full !text-gray-700 md:w-fit"
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};

export default TransferBetweenAccountsModal;
