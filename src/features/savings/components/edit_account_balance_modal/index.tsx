/* eslint-disable max-len */
import { z } from 'zod';
import clsx from 'clsx';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { Input, Select, SelectOption } from '@components';
import { getAllBankAccounts, updateAccount } from '@api/everytrack_backend';

const editAccountBalanceFormSchema = z.object({
  balance: z.string(),
  currencyId: z.string(),
});

export const EditAccountBalanceModal: React.FC = () => {
  const {
    currencies,
    accountTypeId,
    originalBalance,
    originalCurrencyId,
    updateBankAccounts,
    openEditAccountBalanceModal: open,
    updateOpenEditAccountBalanceModal: setOpen,
  } = store();

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
    const { balance, currencyId } = data as z.infer<typeof editAccountBalanceFormSchema>;
    if (accountTypeId) {
      try {
        const { success } = await updateAccount({ balance, currencyId, accountTypeId });
        if (success) {
          setOpen(false);
          const { data } = await getAllBankAccounts();
          updateBankAccounts(data);
        }
        toast('Success!');
      } catch (error: any) {
        console.error(error);
        toast(error.message);
      }
    } else {
      toast('Unexpected error');
    }
  };

  React.useEffect(() => {
    if (originalBalance && originalCurrencyId) {
      reset({ balance: originalBalance, currencyId: originalCurrencyId });
    }
  }, [originalBalance, originalCurrencyId]);

  return (
    <div className={clsx('fixed inset-0 overflow-y-auto', { 'z-0': !open, 'z-10': open })} role="dialog">
      <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div
          className={clsx('fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out', {
            'opacity-100': open,
            'opacity-0': !open,
          })}
          style={{ transition: 'z-index 0s 0s' }}
        ></div>
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
        <div
          className={clsx(
            'relative inline-block w-full max-w-xs transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-lg',
            {
              'translate-y-0 opacity-100 sm:scale-100': open,
              'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95': !open,
            },
          )}
        >
          <div className=" bg-white p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Edit Account Balance</h3>
            <Input label="Balance" formId="balance" register={register} error={errors['balance']?.message} className="mt-4 max-w-none" />
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
            <button
              type="button"
              onClick={handleSubmit(onSubmitEditAccountBalanceForm)}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAccountBalanceModal;
