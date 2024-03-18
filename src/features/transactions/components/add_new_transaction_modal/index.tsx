/* eslint-disable max-len */
import { z } from 'zod';
import clsx from 'clsx';
import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { Button, Dialog } from '@components';
import { TRANSACTION_CATEGORIES } from '@consts';
import { useBankAccounts, useCurrencies, useTransactions } from '@hooks';
import { TransactionCategory, createNewTransaction } from '@api/everytrack_backend';
import AddNewTransactionModalSecondStage from './AddNewTransactionModalSecondStage';
import { AddNewTransactionModalFirstStage } from './AddNewTransactionModalFirstStage';

export const AddNewTransactionModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { bankAccounts } = useBankAccounts();
  const { refetch: refetchTransactions } = useTransactions();
  const { refetch: refetchBankAccounts } = useBankAccounts();
  const { openAddNewTransactionModal: open, updateOpenAddNewTransactionModal: setOpen } = store();

  const [stage, setStage] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const addNewTransactionFormSchema = React.useMemo(
    () =>
      z
        .object({
          income: z.boolean(),
          accountId: z.string(),
          executedAt: z.number(),
          remarks: z.string().optional(),
          name: z.string().min(1, 'Name cannot be empty'),
          currencyId: z.string({ required_error: 'Invalid currency' }),
          amount: z.coerce
            .number()
            .positive('Amount must be greater than 0')
            .transform((input) => String(input)),
          category: z.custom<TransactionCategory>((input: unknown) => {
            return typeof input === 'string' && (TRANSACTION_CATEGORIES as unknown as string[]).includes(input);
          }, 'Invalid category'),
        })
        .superRefine((data, ctx) => {
          const { income, amount, accountId, currencyId } = data;
          if (bankAccounts && accountId && currencyId) {
            const account = bankAccounts.filter(({ id }) => id === accountId)[0];
            if (account.currencyId !== currencyId) {
              ctx.addIssue({
                code: 'custom',
                path: ['currencyId'],
                message: 'Expense currency have to match with bank account currency',
              });
              ctx.addIssue({
                code: 'custom',
                path: ['accountId'],
                message: 'Consider using another account with same currency as this expense record',
              });
            }
            if (!income && new BigNumber(account.balance).isLessThan(amount)) {
              ctx.addIssue({
                code: 'custom',
                path: ['amount'],
                message: 'You are spending more than your bank account balance! 💸💸💸',
              });
            }
          }
        }),
    [bankAccounts],
  );

  const {
    reset,
    watch,
    trigger,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof addNewTransactionFormSchema>>({
    defaultValues: {
      income: false,
      name: undefined,
      amount: undefined,
      remarks: undefined,
      category: undefined,
      accountId: undefined,
      currencyId: undefined,
      executedAt: dayjs().startOf('day').unix(),
    },
    resolver: zodResolver(addNewTransactionFormSchema),
  });

  const onSubmitAddNewTransactionForm = async (data: any) => {
    setIsLoading(true);
    const { name, amount, income, remarks, category, accountId, currencyId, executedAt } = data as z.infer<
      typeof addNewTransactionFormSchema
    >;
    try {
      const { success } = await createNewTransaction({
        name,
        amount,
        remarks,
        category,
        accountId,
        currencyId,
        executedAt,
        income: income.toString(),
      });
      if (success) {
        setOpen(false);
        refetchTransactions();
        refetchBankAccounts();
      }
      setStage(0);
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
    <Dialog open={open} className="max-h-[540px] md:max-h-none md:max-w-sm md:overflow-visible">
      <h3 className="px-4 pb-6 pt-5 text-lg font-medium text-gray-900 md:px-6 md:py-6">Add New Transaction</h3>
      {stage === 0 && (
        <AddNewTransactionModalFirstStage watch={watch} errors={errors} control={control} register={register} setValue={setValue} />
      )}
      {stage === 1 && (
        <AddNewTransactionModalSecondStage errors={errors} control={control} currencies={currencies} bankAccounts={bankAccounts} />
      )}
      <div
        className={clsx('flex flex-col space-y-2 rounded-b-md bg-gray-50 px-4 py-5 md:flex-row md:space-y-0 md:px-6 md:py-3', {
          'justify-end': stage === 0,
          'justify-between': stage !== 0,
        })}
      >
        {stage === 1 && (
          <Button type="button" variant="contained" onClick={() => setStage(0)} className="w-full md:w-fit">
            Back
          </Button>
        )}
        <div className="flex flex-col space-y-2 md:flex-row-reverse md:space-y-0">
          <Button
            type="button"
            variant="contained"
            isLoading={isLoading}
            onClick={
              stage === 0
                ? () => {
                    trigger(['name', 'amount', 'income', 'remarks', 'executedAt']);
                    setStage(1);
                  }
                : handleSubmit(onSubmitAddNewTransactionForm)
            }
            className={clsx('w-full md:ml-2 md:w-fit', { '!bg-gray-700 !text-gray-200 hover:!bg-gray-800': stage !== 0 })}
          >
            {stage === 0 ? 'Next' : 'Add'}
          </Button>
          <Button type="button" variant="outlined" onClick={() => setOpen(false)} className="w-full !text-gray-700 md:w-fit">
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddNewTransactionModal;
