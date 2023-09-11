/* eslint-disable max-len */
import { z } from 'zod';
import clsx from 'clsx';
import React from 'react';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/savings/zustand';
import { Select, SelectOption } from '@components';
import { createNewAccount } from '@api/everytrack_backend';

interface AddNewProviderModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const addNewProviderFormSchema = z.object({
  bank: z.string(),
  currencyId: z.string(),
  accountTypeId: z.string(),
});

export const AddNewProviderModal: React.FC<AddNewProviderModalProps> = ({ open, setOpen }) => {
  const { bankDetails, currencies } = store();

  const {
    watch,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bank: undefined,
      currencyId: undefined,
      accountTypeId: undefined,
    },
    resolver: zodResolver(addNewProviderFormSchema),
  });
  const watchSelectedBank = watch('bank');
  const watchSelectedAccountType = watch('accountTypeId');

  const bankOptions: SelectOption[] = React.useMemo(
    () => (bankDetails ? Object.keys(bankDetails).map((bankDetails) => ({ value: bankDetails, display: bankDetails })) : []),
    [bankDetails],
  );
  const accountTypeOptions: SelectOption[] = React.useMemo(
    () =>
      bankDetails && watchSelectedBank ? bankDetails[String(getValues('bank'))].map(({ id, name }) => ({ value: id, display: name })) : [],
    [bankDetails, watchSelectedBank],
  );
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );

  const onSubmitAddNewProviderForm = async (data: any) => {
    const { currencyId, accountTypeId } = data as z.infer<typeof addNewProviderFormSchema>;
    try {
      const { success } = await createNewAccount({ currencyId, accountTypeId });
      if (success) {
        // TODO: call external API to update accounts
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={clsx('fixed inset-0 z-10 overflow-y-auto', { 'z-0': !open })} role="dialog">
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
            'relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-lg',
            {
              'translate-y-0 opacity-100 sm:scale-100': open,
              'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95': !open,
            },
          )}
        >
          <div className="bg-white p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Add New Provider</h3>
            <Select
              label="Bank"
              formId="bank"
              control={control as Control<any, any>}
              className="mt-4 !max-w-none"
              options={bankOptions}
              placeholder="Select bank..."
              error={errors.bank && errors.bank.message?.toString()}
            />
            {watchSelectedBank && (
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
            <button
              type="button"
              onClick={handleSubmit(onSubmitAddNewProviderForm)}
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

export default AddNewProviderModal;
