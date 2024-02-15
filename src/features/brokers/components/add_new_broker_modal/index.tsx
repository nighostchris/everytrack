/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { createNewAccount } from '@api/everytrack_backend';
import { Button, Dialog, Input, Select, SelectOption } from '@components';
import { useBrokerAccounts, useBrokerDetails, useCountries, useCurrencies } from '@hooks';

const addNewBrokerFormSchema = z.object({
  name: z.string(),
  countryId: z.string(),
  currencyId: z.string(),
  assetProviderId: z.string(),
});

export const AddNewBrokerModal: React.FC = () => {
  const { countries } = useCountries();
  const { currencies } = useCurrencies();
  const { brokerDetails } = useBrokerDetails();
  const { brokerAccounts, refetch: refetchBrokerAccounts } = useBrokerAccounts();
  const { openAddNewBrokerModal: open, updateOpenAddNewBrokerModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof addNewBrokerFormSchema>>({
    defaultValues: {
      name: undefined,
      countryId: undefined,
      currencyId: undefined,
      assetProviderId: undefined,
    },
    resolver: zodResolver(addNewBrokerFormSchema),
  });
  const watchSelectedCountry = watch('countryId');
  const watchSelectedCurrency = watch('currencyId');
  const watchSelectedBroker = watch('assetProviderId');

  const countryOptions: SelectOption[] = React.useMemo(
    () => (countries ? countries.map(({ id, name }) => ({ value: id, display: name })) : []),
    [countries],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );
  const brokerOptions: SelectOption[] = React.useMemo(
    () =>
      brokerDetails && brokerAccounts
        ? brokerDetails
            .filter(({ countryId }) => countryId === watchSelectedCountry)
            .map(({ id, name }) => ({ value: id, display: name }))
            .filter(({ value }) => !brokerAccounts.some(({ assetProviderId }) => value === assetProviderId))
            .sort((a, b) => (a.value > b.value ? 1 : -1))
        : [],
    [brokerDetails, brokerAccounts, watchSelectedCountry],
  );

  const onSubmitAddNewBrokerForm = async (data: any) => {
    setIsLoading(true);
    const { name, currencyId, assetProviderId } = data as z.infer<typeof addNewBrokerFormSchema>;
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
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open}>
      <div className=" rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Broker</h3>
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
            label="Broker"
            formId="assetProviderId"
            control={control as Control<any, any>}
            className="mt-4 !max-w-none"
            options={brokerOptions}
            placeholder="Select broker..."
            error={errors.assetProviderId && errors.assetProviderId.message?.toString()}
          />
        )}
        {watchSelectedBroker && (
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
          onClick={handleSubmit(onSubmitAddNewBrokerForm)}
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

export default AddNewBrokerModal;
