/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { store as globalStore } from '@lib/zustand';
import { getAllAccounts, updateAccount } from '@api/everytrack_backend';
import { Button, Dialog, Input, Select, SelectOption } from '@components';

const editAccountBalanceFormSchema = z.object({
  balance: z.string(),
  currencyId: z.string(),
});

export const EditAccountBalanceModal: React.FC = () => {
  const { currencies, updateBankAccounts } = globalStore();
  const { balance, currencyId, accountTypeId, openEditAccountBalanceModal: open, updateOpenEditAccountBalanceModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof editAccountBalanceFormSchema>>({
    defaultValues: { balance: undefined, currencyId: undefined },
    resolver: zodResolver(editAccountBalanceFormSchema),
  });

  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map(({ id, ticker }) => ({ value: id, display: ticker })) : []),
    [currencies],
  );

  const onSubmitEditAccountBalanceForm = async (data: any) => {
    setIsLoading(true);
    const { balance, currencyId } = data as z.infer<typeof editAccountBalanceFormSchema>;
    if (accountTypeId) {
      try {
        const { success } = await updateAccount({ balance, currencyId, accountTypeId });
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
    } else {
      setIsLoading(false);
      toast.error('Unexpected error');
    }
  };

  React.useEffect(() => {
    if (balance && currencyId) {
      reset({ balance, currencyId });
    }
  }, [balance, currencyId]);

  return (
    <Dialog open={open}>
      <div className=" bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Account Balance</h3>
        <Input label="Balance" formId="balance" register={register} error={errors['balance']?.message} className="mt-4 !max-w-none" />
        <Select
          label="Currency"
          formId="currencyId"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={currencyOptions}
          placeholder="Select currency..."
          error={errors.currencyId && errors.currencyId.message?.toString()}
        />
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitEditAccountBalanceForm)}
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

export default EditAccountBalanceModal;
