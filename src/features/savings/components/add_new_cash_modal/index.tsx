/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCash, useCurrencies } from '@hooks';
import { store } from '@features/savings/zustand';
import { createNewCash } from '@api/everytrack_backend';
import { Button, Dialog, Input, HookedSelect, SelectOption } from '@components';

const addNewCashFormSchema = z.object({
  amount: z.string(),
  currencyId: z.string(),
});

export const AddNewCashModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { cash, refetch: refetchCash } = useCash();
  const { open, setOpen } = store(useShallow((state) => ({ open: state.openAddNewCashModal, setOpen: state.updateOpenAddNewCashModal })));

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof addNewCashFormSchema>>({
    defaultValues: {
      amount: undefined,
      currencyId: undefined,
    },
    resolver: zodResolver(addNewCashFormSchema),
  });
  const watchSelectedCurrency = watch('currencyId');

  const currencyOptions: SelectOption[] = React.useMemo(
    () =>
      cash && currencies
        ? currencies
            .filter(({ id }) => !cash.some(({ currencyId }) => currencyId === id))
            .map((currency) => ({ value: currency.id, display: currency.ticker }))
        : [],
    [cash, currencies],
  );

  const onSubmitAddNewCashForm = async (data: any) => {
    setIsLoading(true);
    const { amount, currencyId } = data as z.infer<typeof addNewCashFormSchema>;
    try {
      const { success } = await createNewCash({ amount, currencyId });
      if (success) {
        setOpen(false);
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
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Cash Holding</h3>
        <p className="mt-1 text-sm">You are adding new cash record for one of the supported currencies</p>
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
          <Input label="Amount" formId="amount" register={register} error={errors.amount?.message} className="mt-4 !max-w-none" />
        )}
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitAddNewCashForm)}
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

export default AddNewCashModal;
