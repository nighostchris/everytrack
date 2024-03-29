/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { createNewAccount } from '@api/everytrack_backend';
import { useBrokerAccounts, useBrokerDetails, useCurrencies } from '@hooks';
import { Button, Dialog, HookedInput, HookedSelect, SelectOption } from '@components';

const addNewAccountFormSchema = z.object({
  name: z.string(),
  currencyId: z.string(),
  assetProviderId: z.string(),
});

export const AddNewAccountModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { brokerDetails } = useBrokerDetails();
  const { refetch: refetchBrokerAccounts } = useBrokerAccounts();
  const { assetProviderId, openAddNewAccountModal: open, updateOpenAddNewAccountModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
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

  const brokerName = React.useMemo(
    () => (brokerDetails && assetProviderId ? brokerDetails.filter(({ id }) => id === assetProviderId)[0].name : ''),
    [assetProviderId, brokerDetails],
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
    reset({ assetProviderId });
  }, [assetProviderId]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open}>
      <div className=" rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Account</h3>
        <p className="mt-1 text-sm">{`You are adding account for ${brokerName}`}</p>
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
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitAddNewAccountForm)}
          className="w-full sm:ml-2 sm:w-fit"
        >
          Add
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

export default AddNewAccountModal;
