/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { store as globalStore } from '@lib/zustand';
import { Button, Dialog, Input, Select, SelectOption } from '@components';
import { createNewAccount, getAllAccounts } from '@api/everytrack_backend';

const addNewProviderFormSchema = z.object({
  name: z.string(),
  countryId: z.string(),
  currencyId: z.string(),
  assetProviderId: z.string(),
});

export const AddNewProviderModal: React.FC = () => {
  const { countries, currencies, bankAccounts, updateBankAccounts } = globalStore();
  const { bankDetails, openAddNewProviderModal: open, updateOpenAddNewProviderModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof addNewProviderFormSchema>>({
    defaultValues: {
      name: undefined,
      countryId: undefined,
      currencyId: undefined,
      assetProviderId: undefined,
    },
    resolver: zodResolver(addNewProviderFormSchema),
  });
  const watchSelectedCountry = watch('countryId');
  const watchSelectedCurrency = watch('currencyId');
  const watchSelectedBank = watch('assetProviderId');

  const countryOptions: SelectOption[] = React.useMemo(
    () => (countries ? countries.map(({ id, name }) => ({ value: id, display: name })) : []),
    [countries],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map(({ id, ticker }) => ({ value: id, display: ticker })) : []),
    [currencies],
  );
  const bankOptions: SelectOption[] = React.useMemo(
    () =>
      bankDetails && bankAccounts && watchSelectedCountry
        ? bankDetails
            .filter(({ countryId }) => countryId === watchSelectedCountry)
            .map(({ id, name }) => ({ value: id, display: name }))
            .filter(({ value }) => !bankAccounts.some(({ assetProviderId }) => value === assetProviderId))
            .sort((a, b) => (a.display > b.display ? 1 : -1))
        : [],
    [bankDetails, bankAccounts, watchSelectedCountry],
  );

  const onSubmitAddNewProviderForm = async (data: any) => {
    setIsLoading(true);
    const { name, currencyId, assetProviderId } = data as z.infer<typeof addNewProviderFormSchema>;
    try {
      const { success } = await createNewAccount({ name, currencyId, assetProviderId });
      if (success) {
        setOpen(false);
        const { data } = await getAllAccounts('savings');
        updateBankAccounts(data);
        reset();
      }
      setIsLoading(false);
      toast.info('Success!');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Provider</h3>
        <Select
          label="Country"
          formId="countryId"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={countryOptions}
          placeholder="Select country of bank..."
          error={errors.countryId && errors.countryId.message?.toString()}
        />
        {watchSelectedCountry && (
          <Select
            label="Bank"
            formId="assetProviderId"
            control={control as Control<any, any>}
            className="mt-4 !max-w-none"
            options={bankOptions}
            placeholder="Select bank..."
            error={errors.assetProviderId && errors.assetProviderId.message?.toString()}
          />
        )}
        {watchSelectedBank && (
          <Select
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
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitAddNewProviderForm)}
          className="w-full sm:ml-2 sm:w-28"
        >
          Add
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setOpen(false)}
          className="mt-3 w-full !border-gray-300 !text-gray-700 hover:!bg-gray-200 hover:!text-gray-800 sm:mt-0 sm:w-28"
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};

export default AddNewProviderModal;
