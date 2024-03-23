/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { Provider, transferBetweenAccounts } from '@api/everytrack_backend';
import { Button, Dialog, ComboboxGroups, HookedSingleCombobox, HookedInput } from '@components';
import { useCountries, useCurrencies, useBankAccounts, useBankDetails, useTransactions, useBrokerAccounts, useBrokerDetails } from '@hooks';

const transferBetweenAccountsFormSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Amount must be greater than 0')
    .transform((input) => String(input)),
  sourceAccountId: z.string().min(1, 'Invalid source account'),
  targetAccountId: z.string().min(1, 'Invalid target account'),
});

export const TransferBetweenAccountsModal: React.FC = () => {
  const { countries } = useCountries();
  const { bankDetails } = useBankDetails();
  const { brokerDetails } = useBrokerDetails();
  const { currencies, currenciesMap } = useCurrencies();
  const { refetch: refetchTransactions } = useTransactions();
  const { bankAccounts, refetch: refetchBankAccounts } = useBankAccounts();
  const { brokerAccounts, refetch: refetchBrokerAccounts } = useBrokerAccounts();
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

  const assetProviderDetailsMap = React.useMemo(() => {
    const map = new Map<string, Provider>();
    if (bankDetails && brokerDetails) {
      [...bankDetails, ...brokerDetails].forEach((detail) => map.set(detail.id, detail));
    }
    return map;
  }, [bankDetails, brokerDetails]);
  const accountDetailsMap = React.useMemo(() => {
    const map = new Map<string, { countryId: string; currencyId: string; assetProviderName: string }>();
    if (bankAccounts && brokerAccounts && bankDetails && brokerDetails) {
      [...bankAccounts, ...brokerAccounts].forEach(({ id: accountId, assetProviderId, currencyId }) =>
        map.set(accountId, {
          currencyId,
          countryId: assetProviderDetailsMap.get(assetProviderId)!.countryId,
          assetProviderName: assetProviderDetailsMap.get(assetProviderId)!.name,
        }),
      );
    }
    return map;
  }, [bankAccounts, brokerAccounts, bankDetails, brokerDetails]);
  const accountByCountryGroups: (enableRecipients: boolean) => ComboboxGroups = React.useCallback(
    (enableRecipients) => {
      if (countries && currencies && bankDetails && brokerDetails && bankAccounts && brokerAccounts) {
        return countries.reduce((acc, { id, code }) => {
          const originalGroups = { ...acc };
          const potentialNewGroupItems = [...bankAccounts, ...brokerAccounts]
            .filter(
              ({ id: accountId, balance, currencyId }) =>
                (enableRecipients ? accountId !== watchSourceAccountId : true) &&
                (enableRecipients ? true : new BigNumber(balance).isGreaterThan(0)) &&
                (enableRecipients ? currencyId === accountDetailsMap.get(watchSourceAccountId)!.currencyId : true) &&
                id === accountDetailsMap.get(accountId)!.countryId,
            )
            .map(({ id: accountId, name, balance, currencyId }) => ({
              value: accountId,
              display: `${accountDetailsMap.get(accountId)!.assetProviderName}(${name}) - ${currenciesMap.get(currencyId)!.symbol}${balance}`,
            }))
            .sort((a, b) => (a.display > b.display ? 1 : -1));
          return potentialNewGroupItems.length > 0 ? { ...acc, [code]: potentialNewGroupItems } : originalGroups;
        }, {});
      }
      return {};
    },
    [countries, currencies, bankDetails, brokerDetails, bankAccounts, brokerAccounts, watchSourceAccountId],
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
        refetchBrokerAccounts();
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
          groups={accountByCountryGroups(false)}
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
              groups={accountByCountryGroups(true)}
              placeholder="Select target account..."
              control={control as Control<any, any>}
              className="mt-4 !max-w-none"
              error={errors.targetAccountId && errors.targetAccountId.message?.toString()}
            />
            <HookedInput
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
