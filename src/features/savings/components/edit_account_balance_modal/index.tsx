/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { useBankAccounts, useCurrencies } from '@hooks';
import { updateAccount } from '@api/everytrack_backend';
import { Button, Dialog, Input, HookedSelect, SelectOption } from '@components';

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
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof editAccountBalanceFormSchema>>({
    defaultValues: {
      balance: undefined,
      currencyId: undefined,
      accountTypeId: undefined,
    },
    resolver: zodResolver(editAccountBalanceFormSchema),
  });

  const bankAccountName = React.useMemo(
    () => (bankAccounts && accountTypeId ? bankAccounts.filter(({ accountTypeId: id }) => id === accountTypeId)[0].name : ''),
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
    <Dialog open={open} className="md:max-w-sm">
      <div className="rounded-t-md bg-white px-4 pb-6 pt-5 md:px-6 md:py-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Account Balance</h3>
        <p className="mt-1 text-sm">{`You are editing balance for ${bankAccountName}`}</p>
        <Input label="Balance" formId="balance" register={register} error={errors['balance']?.message} className="mt-4 !max-w-none" />
        <HookedSelect
          label="Currency"
          formId="currencyId"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={currencyOptions}
          placeholder="Select currency..."
          error={errors.currencyId && errors.currencyId.message?.toString()}
        />
        <p className="mt-4 text-sm text-red-600">{`You need to bear responsibility of manual balance adjustment as this may corrupt the existing system balance calculation based on completed transactions for this account!`}</p>
      </div>
      <div className="flex flex-col space-y-2 rounded-b-md bg-gray-50 px-4 py-5 md:flex-row-reverse md:space-y-0 md:px-6 md:py-3">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitEditAccountBalanceForm)}
          className="w-full md:ml-2 md:w-fit"
        >
          Submit
        </Button>
        <Button type="button" variant="outlined" onClick={() => setOpen(false)} className="w-full !text-gray-700 md:w-fit">
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};

export default EditAccountBalanceModal;
