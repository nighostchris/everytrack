/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { createNewAccount } from '@api/everytrack_backend';
import { useBankAccounts, useBankDetails, useCurrencies } from '@hooks';
import { Button, Dialog, HookedInput, HookedSelect, SelectOption } from '@components';

const addNewAccountFormSchema = z.object({
  name: z.string(),
  currencyId: z.string(),
  assetProviderId: z.string(),
});

export const AddNewAccountModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { bankDetails } = useBankDetails();
  const { refetch: refetchBankAccounts } = useBankAccounts();
  const { assetProviderId, resetAddNewAccountModalState, openAddNewAccountModal: open, updateOpenAddNewAccountModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof addNewAccountFormSchema>>({
    defaultValues: {
      name: undefined,
      currencyId: undefined,
      assetProviderId: undefined,
    },
    resolver: zodResolver(addNewAccountFormSchema),
  });
  const watchSelectedCurrency = watch('currencyId');

  const bankName = React.useMemo(
    () => (bankDetails && assetProviderId ? bankDetails.filter(({ id }) => id === assetProviderId)[0].name : ''),
    [assetProviderId, bankDetails],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );

  const onSubmitAddNewAccountForm = async (data: any) => {
    setIsLoading(true);
    const { name, currencyId, assetProviderId } = data as z.infer<typeof addNewAccountFormSchema>;
    try {
      const { success } = await createNewAccount({ name, currencyId, assetProviderId });
      if (success) {
        setOpen(false);
        resetAddNewAccountModalState();
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
    reset({ assetProviderId });
  }, [assetProviderId]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open} className="md:max-w-sm">
      <div className="rounded-t-md bg-white px-4 pb-6 pt-5 md:px-6 md:py-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Account</h3>
        <p className="mt-1 text-sm">{`You are adding account for ${bankName}`}</p>
        <HookedSelect
          label="Currency"
          formId="currencyId"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={currencyOptions}
          placeholder="Select currency..."
          error={errors.currencyId && errors.currencyId.message?.toString()}
        />
        {watchSelectedCurrency && (
          <HookedInput label="Account Name" formId="name" register={register} error={errors.name?.message} className="mt-4 !max-w-none" />
        )}
      </div>
      <div className="flex flex-col space-y-2 rounded-b-md bg-gray-50 px-4 py-5 md:flex-row-reverse md:space-y-0 md:px-6 md:py-3">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitAddNewAccountForm)}
          className="w-full md:ml-2 md:w-fit"
        >
          Add
        </Button>
        <Button type="button" variant="outlined" onClick={() => setOpen(false)} className="w-full !text-gray-700 md:w-fit">
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};

export default AddNewAccountModal;
