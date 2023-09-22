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
  currencyId: z.string(),
  assetProviderId: z.string(),
});

export const AddNewProviderModal: React.FC = () => {
  const { currencies, updateBankAccounts } = globalStore();
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
      currencyId: undefined,
      assetProviderId: undefined,
    },
    resolver: zodResolver(addNewProviderFormSchema),
  });
  const watchSelectedCurrency = watch('currencyId');
  const watchSelectedBank = watch('assetProviderId');

  const bankOptions: SelectOption[] = React.useMemo(
    () =>
      bankDetails ? bankDetails.map(({ id, name }) => ({ value: id, display: name })).sort((a, b) => (a.display > b.display ? 1 : -1)) : [],
    [bankDetails],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
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
      <div className=" bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Provider</h3>
        <Select
          label="Bank"
          formId="assetProviderId"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={bankOptions}
          placeholder="Select bank..."
          error={errors.assetProviderId && errors.assetProviderId.message?.toString()}
        />
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
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitAddNewProviderForm)}
          className="w-full sm:ml-2 sm:w-fit"
        >
          Submit
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setOpen(false)}
          className="mt-3 w-full !border-gray-300 !text-gray-700 hover:!bg-gray-200 sm:mt-0 sm:w-fit"
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};

export default AddNewProviderModal;
