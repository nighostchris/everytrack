/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { TRANSACTION_CATEGORIES } from '@consts';
import { useBankAccounts, useCurrencies, useTransactions } from '@hooks';
import { Currency, TransactionCategory, createNewTransaction } from '@api/everytrack_backend';
import { Button, DatePicker, Dialog, Input, Select, SelectOption, Switch } from '@components';

export const AddNewTransactionModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { bankAccounts } = useBankAccounts();
  const { refetch: refetchTransactions } = useTransactions();
  const { refetch: refetchBankAccounts } = useBankAccounts();
  const { openAddNewTransactionModal: open, updateOpenAddNewTransactionModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const addNewTransactionFormSchema = React.useMemo(
    () =>
      z
        .object({
          income: z.boolean(),
          executedAt: z.number(),
          useAccount: z.boolean(),
          remarks: z.string().optional(),
          accountId: z.string().optional(),
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
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof addNewTransactionFormSchema>>({
    defaultValues: {
      income: false,
      name: undefined,
      useAccount: false,
      amount: undefined,
      remarks: undefined,
      category: undefined,
      accountId: undefined,
      currencyId: undefined,
      executedAt: dayjs().startOf('day').unix(),
    },
    resolver: zodResolver(addNewTransactionFormSchema),
  });
  const watchSelectedExecutedAt = watch('executedAt');
  const watchSelectedUseAccount = watch('useAccount');

  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );
  const categoryOptions: SelectOption[] = TRANSACTION_CATEGORIES.map((category) => ({
    value: category,
    display: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
  })).sort((a, b) => (a.value > b.value ? 1 : -1));
  const bankOptions: SelectOption[] = React.useMemo(() => {
    if (bankAccounts && currencies) {
      const currenciesMap = new Map<string, Currency>();
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      return bankAccounts.map(({ id, name, balance, currencyId }) => {
        const currency = (currenciesMap.get(currencyId) as Currency).symbol;
        return { value: id, display: `${name} - ${currency} ${new BigNumber(balance).toFormat(2)}` };
      });
    }
    return [];
  }, [bankAccounts]);

  const executionDate = React.useMemo(() => dayjs.unix(watchSelectedExecutedAt).toDate(), [watchSelectedExecutedAt]);

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
    <Dialog open={open} className="max-h-[540px] overflow-y-auto md:max-h-none md:max-w-2xl lg:max-w-4xl lg:overflow-visible">
      <div className="space-y-6 rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Transaction</h3>
        <div className="grid gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-0">
          <Input label="Name" formId="name" register={register} error={errors.name?.message} className="!max-w-none" />
          <Input label="Amount" formId="amount" register={register} error={errors.amount?.message} className="!max-w-none" />
          <Select
            label="Category"
            formId="category"
            control={control as Control<any, any>}
            className="!max-w-none"
            options={categoryOptions}
            placeholder="Select category..."
            error={errors.category && errors.category.message?.toString()}
          />
        </div>
        <div className="grid gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-0">
          <Select
            label="Currency"
            formId="currencyId"
            control={control as Control<any, any>}
            className="!max-w-none"
            options={currencyOptions}
            placeholder="Select currency..."
            error={errors.currencyId && errors.currencyId.message?.toString()}
          />
          <Switch
            formId="income"
            label="Is it income?"
            control={control as Control<any, any>}
            error={errors.income && errors.income.message?.toString()}
          />
          <DatePicker
            label="Execution Date"
            date={executionDate}
            toDate={new Date()}
            setDate={(newDate) => {
              if (newDate) {
                setValue('executedAt', dayjs(newDate).unix());
              }
            }}
            className="[&>button]:w-full"
          />
        </div>
        <div className="grid gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-0">
          <Switch
            label="Use Account"
            formId="useAccount"
            control={control as Control<any, any>}
            error={errors.useAccount && errors.useAccount.message?.toString()}
          />
          {watchSelectedUseAccount && (
            <Select
              label="Related Account"
              formId="accountId"
              control={control as Control<any, any>}
              className="!max-w-none md:col-span-2"
              options={bankOptions}
              placeholder="Select account..."
              error={errors.accountId && errors.accountId.message?.toString()}
            />
          )}
        </div>
        <Input label="Remarks (optional)" formId="remarks" register={register} error={errors.remarks?.message} className="!max-w-none" />
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitAddNewTransactionForm)}
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

export default AddNewTransactionModal;