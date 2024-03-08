/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCash, useCurrencies } from '@hooks';
import { store } from '@features/savings/zustand';
import { updateCash } from '@api/everytrack_backend';
import { Button, Dialog, Input, HookedSelect, SelectOption } from '@components';

const editCashBalanceFormSchema = z.object({
  cashId: z.string(),
  currencyId: z.string(),
  amount: z.coerce
    .number()
    .positive('Amount must be greater than 0')
    .transform((input) => String(input)),
});

export const EditCashBalanceModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { cash, refetch: refetchCash } = useCash();
  const { open, setOpen, cashId, amount, currencyId, resetEditCashModalState } = store(
    useShallow(({ cashId, amount, currencyId, openEditCashModal: open, updateOpenEditCashModal: setOpen, resetEditCashModalState }) => ({
      open,
      cashId,
      amount,
      setOpen,
      currencyId,
      resetEditCashModalState,
    })),
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof editCashBalanceFormSchema>>({
    defaultValues: {
      amount: undefined,
      cashId: undefined,
      currencyId: undefined,
    },
    resolver: zodResolver(editCashBalanceFormSchema),
  });

  const cashHoldingName = React.useMemo(() => {
    if (cash && cashId && currencies) {
      const currencyId = cash.filter(({ id }) => id === cashId)[0].currencyId;
      const { ticker } = currencies.filter(({ id }) => id === currencyId)[0];
      return ticker;
    }
    return '';
  }, [cash, cashId]);
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map(({ id, ticker }) => ({ value: id, display: ticker })) : []),
    [currencies],
  );

  const onSubmitEditCashBalanceForm = async (data: any) => {
    setIsLoading(true);
    const { cashId, amount, currencyId } = data as z.infer<typeof editCashBalanceFormSchema>;
    try {
      const { success } = await updateCash({ id: cashId, amount, currencyId });
      if (success) {
        setOpen(false);
        resetEditCashModalState();
        refetchCash();
      }
      setIsLoading(false);
      toast.info('Success!');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    if (cashId && amount && currencyId) {
      reset({ cashId, amount, currencyId });
    }
  }, [cashId, amount, currencyId]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Cash Holding Balance</h3>
        <p className="mt-1 text-sm">{`You are editing balance for ${cashHoldingName}`}</p>
        <Input label="Amount" formId="amount" register={register} error={errors.amount?.message} className="mt-4 !max-w-none" />
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
          onClick={handleSubmit(onSubmitEditCashBalanceForm)}
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

export default EditCashBalanceModal;
