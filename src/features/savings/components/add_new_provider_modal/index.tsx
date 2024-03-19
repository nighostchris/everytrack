/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { createNewAccount } from '@api/everytrack_backend';
import { useCountries, useCurrencies, useBankAccounts, useBankDetails } from '@hooks';
import { Button, Dialog, Input, HookedSelect, SelectOption, ComboboxGroups, HookedSingleCombobox } from '@components';

const addNewProviderFormSchema = z.object({
  name: z.string(),
  countryId: z.string(),
  currencyId: z.string(),
  assetProviderId: z.string(),
});

export const AddNewProviderModal: React.FC = () => {
  const { countries } = useCountries();
  const { currencies } = useCurrencies();
  const { bankDetails } = useBankDetails();
  const { bankAccounts, refetch: refetchBankAccounts } = useBankAccounts();
  const { openAddNewProviderModal: open, updateOpenAddNewProviderModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof addNewProviderFormSchema>>({
    defaultValues: {
      name: undefined,
      countryId: undefined,
      currencyId: undefined,
      assetProviderId: undefined,
    },
    resolver: zodResolver(addNewProviderFormSchema),
  });
  const watchSelectedCurrency = watch('currencyId');
  const watchSelectedBank = watch('assetProviderId');

  const providerCountryIdMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (bankDetails) {
      bankDetails.forEach(({ id, countryId }) => map.set(id, countryId));
    }
    return map;
  }, [bankDetails]);
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map(({ id, ticker }) => ({ value: id, display: ticker })) : []),
    [currencies],
  );
  const bankByCountryGroups: ComboboxGroups = React.useMemo(() => {
    if (countries && bankDetails && bankAccounts) {
      const providerExistenceMap = new Map<string, boolean>();
      bankAccounts.forEach(({ assetProviderId }) => providerExistenceMap.set(assetProviderId, true));
      return countries.reduce((acc, { id, code }) => {
        const originalGroups = { ...acc };
        const potentialNewGroupItems = bankDetails
          .filter(({ id: assetProviderId, countryId }) => id === countryId && !providerExistenceMap.has(assetProviderId))
          .map(({ id, name }) => ({ value: id, display: name }))
          .sort((a, b) => (a.display > b.display ? 1 : -1));
        return potentialNewGroupItems.length > 0 ? { ...acc, [code]: potentialNewGroupItems } : originalGroups;
      }, {});
    }
    return {};
  }, [countries, bankDetails, bankAccounts]);

  const onSubmitAddNewProviderForm = async (data: any) => {
    setIsLoading(true);
    const { name, currencyId, assetProviderId } = data as z.infer<typeof addNewProviderFormSchema>;
    try {
      const { success } = await createNewAccount({ name, currencyId, assetProviderId });
      if (success) {
        setOpen(false);
        refetchBankAccounts();
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

  React.useEffect(() => {
    if (bankDetails && watchSelectedBank) {
      setValue('countryId', providerCountryIdMap.get(watchSelectedBank)!);
    }
  }, [bankDetails, watchSelectedBank]);

  return (
    <Dialog open={open} className="md:max-w-sm">
      <div className="rounded-t-md bg-white px-4 pb-6 pt-5 md:px-6 md:py-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Provider</h3>
        <HookedSingleCombobox
          label="Bank"
          formId="assetProviderId"
          groups={bankByCountryGroups}
          placeholder="Select bank..."
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          error={errors.assetProviderId && errors.assetProviderId.message?.toString()}
        />
        {watchSelectedBank && (
          <HookedSelect
            label="Currency"
            formId="currencyId"
            control={control as Control<any, any>}
            className="mt-4 !max-w-none"
            options={currencyOptions}
            placeholder="Select currency..."
            error={errors.currencyId && errors.currencyId.message?.toString()}
          />
        )}
        {watchSelectedCurrency && (
          <Input label="Account Name" formId="name" register={register} error={errors.name?.message} className="mt-4 !max-w-none" />
        )}
      </div>
      <div className="flex flex-col space-y-2 rounded-b-md bg-gray-50 px-4 py-5 md:flex-row-reverse md:space-y-0 md:px-6 md:py-3">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitAddNewProviderForm)}
          className="w-full md:ml-2 md:w-fit"
        >
          Add
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

export default AddNewProviderModal;
