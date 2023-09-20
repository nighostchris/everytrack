/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { store as globalStore } from '@lib/zustand';
import { Button, Dialog, Select, SelectOption } from '@components';
import { createNewAccount, getAllAccounts } from '@api/everytrack_backend';

const addNewBrokerFormSchema = z.object({
  broker: z.string(),
  currencyId: z.string(),
  accountTypeId: z.string(),
});

export const AddNewBrokerModal: React.FC = () => {
  const { currencies } = globalStore();
  const {
    brokerDetails,
    brokerAccounts,
    updateBrokerAccounts,
    openAddNewBrokerModal: open,
    updateOpenAddNewBrokerModal: setOpen,
  } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      broker: undefined,
      currencyId: undefined,
      accountTypeId: undefined,
    },
    resolver: zodResolver(addNewBrokerFormSchema),
  });
  const watchSelectedBroker = watch('broker');
  const watchSelectedAccountType = watch('accountTypeId');

  const brokerAccountsMap = React.useMemo(() => {
    const map = new Map<string, boolean>();
    (brokerAccounts ?? []).forEach(({ accountTypeId }) => map.set(accountTypeId, true));
    return map;
  }, [brokerAccounts]);

  const brokerOptions: SelectOption[] = React.useMemo(
    () =>
      brokerDetails && brokerAccounts
        ? brokerDetails
            .filter(({ accountTypes }) => !accountTypes.every(({ id }) => brokerAccountsMap.get(id)))
            .map(({ name }) => ({ value: name, display: name }))
            .sort((a, b) => (a.value > b.value ? 1 : -1))
        : [],
    [brokerDetails, brokerAccounts],
  );
  const accountTypeOptions: SelectOption[] = React.useMemo(
    () =>
      brokerDetails && brokerAccounts && watchSelectedBroker
        ? brokerDetails
            .filter(({ name }) => name === watchSelectedBroker)[0]
            .accountTypes.filter((accountType) => !brokerAccountsMap.get(accountType.id))
            .map(({ id, name }) => ({ value: id, display: name }))
            .sort((a, b) => (a.display > b.display ? 1 : -1))
        : [],
    [brokerDetails, brokerAccounts, watchSelectedBroker],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );

  const onSubmitAddNewBrokerForm = async (data: any) => {
    setIsLoading(true);
    const { currencyId, accountTypeId } = data as z.infer<typeof addNewBrokerFormSchema>;
    try {
      const { success } = await createNewAccount({ currencyId, accountTypeId });
      if (success) {
        setOpen(false);
        const { data } = await getAllAccounts('broker');
        updateBrokerAccounts(data);
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
        <h3 className="text-lg font-medium text-gray-900">Add New Broker</h3>
        <Select
          label="Broker"
          formId="broker"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={brokerOptions}
          placeholder="Select broker..."
          error={errors.broker && errors.broker.message?.toString()}
        />
        {watchSelectedBroker && (
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
          onClick={handleSubmit(onSubmitAddNewBrokerForm)}
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

export default AddNewBrokerModal;
