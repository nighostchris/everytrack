/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { useBankAccounts, useCurrencies } from '@hooks';
import { updateAccount } from '@api/everytrack_backend';
import { Button, Dialog, Input, Select, SelectOption } from '@components';

const editAccountBalanceFormSchema = z.object({
  balance: z.string(),
  currencyId: z.string(),
  accountTypeId: z.string(),
});

export const EditAccountBalanceModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const {
    balance,
    currencyId,
    accountTypeId,
    resetEditAccountBalanceModalState,
    openEditAccountBalanceModal: open,
    updateOpenEditAccountBalanceModal: setOpen,
  } = store();
  const { bankAccounts, refetch: refetchBankAccounts } = useBankAccounts();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof editAccountBalanceFormSchema>>({
    defaultValues: {
      balance: undefined,
      currencyId: undefined,
      accountTypeId: undefined,
    },
    resolver: zodResolver(editAccountBalanceFormSchema),
  });

  const bankAccountName = React.useMemo(
    () => (bankAccounts && accountTypeId ? bankAccounts.filter(({ accountTypeId }) => accountTypeId === accountTypeId)[0].name : ''),
    [accountTypeId, bankAccounts],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map(({ id, ticker }) => ({ value: id, display: ticker })) : []),
    [currencies],
  );

  const onSubmitEditAccountBalanceForm = async (data: any) => {
    setIsLoading(true);
    const { balance, currencyId, accountTypeId } = data as z.infer<typeof editAccountBalanceFormSchema>;
    try {
      const { success } = await updateAccount({ balance, currencyId, accountTypeId });
      if (success) {
        setOpen(false);
        resetEditAccountBalanceModalState();
        refetchBankAccounts();
        reset();
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

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Account Balance</h3>
        <p className="mt-1 text-sm">{`You are editing balance for ${bankAccountName}`}</p>
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
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
