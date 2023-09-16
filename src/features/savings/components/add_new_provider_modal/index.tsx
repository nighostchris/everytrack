/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { store as globalStore } from '@lib/zustand';
import { Button, Dialog, Select, SelectOption } from '@components';
import { createNewAccount, getAllAccounts } from '@api/everytrack_backend';

const addNewProviderFormSchema = z.object({
  bank: z.string(),
  currencyId: z.string(),
  accountTypeId: z.string(),
});

export const AddNewProviderModal: React.FC = () => {
  const { currencies } = globalStore();
  const { bankDetails, updateBankAccounts, openAddNewProviderModal: open, updateOpenAddNewProviderModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof addNewProviderFormSchema>>({
    defaultValues: {
      bank: undefined,
      currencyId: undefined,
      accountTypeId: undefined,
    },
    resolver: zodResolver(addNewProviderFormSchema),
  });
  const watchSelectedBank = watch('bank');
  const watchSelectedAccountType = watch('accountTypeId');

  const bankOptions: SelectOption[] = React.useMemo(
    () => (bankDetails ? bankDetails.map(({ name }) => ({ value: name, display: name })).sort((a, b) => (a.value > b.value ? 1 : -1)) : []),
    [bankDetails],
  );
  const accountTypeOptions: SelectOption[] = React.useMemo(
    () =>
      bankDetails && watchSelectedBank
        ? bankDetails
            .filter(({ name }) => name === watchSelectedBank)[0]
            .accountTypes.map(({ id, name }) => ({ value: id, display: name }))
            .sort((a, b) => (a.display > b.display ? 1 : -1))
        : [],
    [bankDetails, watchSelectedBank],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );

  const onSubmitAddNewProviderForm = async (data: any) => {
    setIsLoading(true);
    const { currencyId, accountTypeId } = data as z.infer<typeof addNewProviderFormSchema>;
    try {
      const { success } = await createNewAccount({ currencyId, accountTypeId });
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
          formId="bank"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={bankOptions}
          placeholder="Select bank..."
          error={errors.bank && errors.bank.message?.toString()}
        />
        {watchSelectedBank && (
          <Select
            label="Account Type"
            formId="accountTypeId"
            control={control as Control<any, any>}
            className="mt-4 !max-w-none"
            options={accountTypeOptions}
            placeholder="Select account type..."
            error={errors.accountTypeId && errors.accountTypeId.message?.toString()}
          />
        )}
        {watchSelectedAccountType && (
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
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
};

export default AddNewProviderModal;
