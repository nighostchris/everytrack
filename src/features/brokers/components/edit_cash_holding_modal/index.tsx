/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { updateAccount } from '@api/everytrack_backend';
import { useBrokerAccounts, useCurrencies } from '@hooks';
import { Button, Dialog, HookedInput, HookedSelect, SelectOption } from '@components';

const editCashHoldingFormSchema = z.object({
  accountTypeId: z.string(),
  currencyId: z.string({ required_error: 'Invalid currency ' }),
  balance: z.coerce
    .number()
    .positive('Balance must be greater than 0')
    .transform((input) => String(input)),
});

export const EditCashHoldingModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const {
    balance,
    currencyId,
    accountTypeId,
    resetEditCashHoldingModalState,
    openEditCashHoldingModal: open,
    updateOpenEditCashHoldingModalState: setOpen,
  } = store();
  const { brokerAccounts, refetch: refetchBrokerAccounts } = useBrokerAccounts();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof editCashHoldingFormSchema>>({
    defaultValues: {
      balance: undefined,
      currencyId: undefined,
      accountTypeId: undefined,
    },
    resolver: zodResolver(editCashHoldingFormSchema),
  });

  const brokerAccountName = React.useMemo(
    () => (brokerAccounts && accountTypeId ? brokerAccounts.filter(({ accountTypeId: id }) => id === accountTypeId)[0].name : ''),
    [accountTypeId, brokerAccounts],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map(({ id, ticker }) => ({ value: id, display: ticker })) : []),
    [currencies],
  );

  const onSubmitEditCashHoldingForm = async (data: any) => {
    setIsLoading(true);
    const { balance, currencyId, accountTypeId } = data as z.infer<typeof editCashHoldingFormSchema>;
    try {
      const { success } = await updateAccount({ balance, currencyId, accountTypeId });
      if (success) {
        setOpen(false);
        resetEditCashHoldingModalState();
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
    if (balance && currencyId && accountTypeId) {
      reset({ balance, currencyId, accountTypeId });
    }
  }, [balance, currencyId, accountTypeId]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Cash Holding</h3>
        <p className="mt-1 text-sm">{`You are editing cash holding for ${brokerAccountName}`}</p>
        <HookedInput label="Cash" formId="balance" register={register} error={errors['balance']?.message} className="mt-4 !max-w-none" />
        <HookedSelect
          label="Currency"
          formId="currencyId"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={currencyOptions}
          placeholder="Select currency..."
          error={errors.currencyId && errors.currencyId.message?.toString()}
        />
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitEditCashHoldingForm)}
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

export default EditCashHoldingModal;
