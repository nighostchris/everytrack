/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { EXPENSE_CATEGORIES } from '@consts';
import { useBankAccounts, useCurrencies, useExpenses } from '@hooks';
import { Currency, ExpenseCategory, createNewExpense } from '@api/everytrack_backend';
import { Button, DatePicker, Dialog, Input, Select, SelectOption, Switch } from '@components';

export const AddNewExpenseModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { bankAccounts } = useBankAccounts();
  const { refetch: refetchExpenses } = useExpenses();
  const { refetch: refetchBankAccounts } = useBankAccounts();
  const { openAddNewExpenseModal: open, updateOpenAddNewExpenseModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [useAccount, setUseAccount] = React.useState<boolean>(false);

  const addNewExpenseFormSchema = React.useMemo(
    () =>
      z
        .object({
          executedAt: z.number(),
          remarks: z.string().optional(),
          accountId: z.string().optional(),
          name: z.string().min(1, 'Name cannot be empty'),
          currencyId: z.string({ required_error: 'Invalid currency' }),
          amount: z.coerce
            .number()
            .positive('Amount must be greater than 0')
            .transform((input) => String(input)),
          category: z.custom<ExpenseCategory>((input: unknown) => {
            return typeof input === 'string' && (EXPENSE_CATEGORIES as unknown as string[]).includes(input);
          }, 'Invalid category'),
        })
        .superRefine((data, ctx) => {
          const { amount, accountId, currencyId } = data;
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
            if (new BigNumber(account.balance).isLessThan(amount)) {
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
  } = useForm<z.infer<typeof addNewExpenseFormSchema>>({
    defaultValues: {
      name: undefined,
      amount: undefined,
      remarks: undefined,
      category: undefined,
      accountId: undefined,
      currencyId: undefined,
      executedAt: dayjs().unix(),
    },
    resolver: zodResolver(addNewExpenseFormSchema),
  });
  const watchSelectedExecutedAt = watch('executedAt');

  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );
  const categoryOptions: SelectOption[] = EXPENSE_CATEGORIES.map((category) => ({
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

  const spentDate = React.useMemo(() => dayjs.unix(watchSelectedExecutedAt).toDate(), [watchSelectedExecutedAt]);

  const onSubmitAddNewExpenseForm = async (data: any) => {
    setIsLoading(true);
    const { name, amount, remarks, category, accountId, currencyId, executedAt } = data as z.infer<typeof addNewExpenseFormSchema>;
    try {
      const { success } = await createNewExpense({ name, amount, remarks, category, accountId, currencyId, executedAt });
      if (success) {
        setOpen(false);
        setUseAccount(false);
        refetchExpenses();
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
    <Dialog open={open} className="max-h-[540px] overflow-y-auto md:max-h-none lg:max-w-xl lg:overflow-visible">
      <div className="space-y-6 rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Expense</h3>
        <Input label="Name" formId="name" register={register} error={errors.name?.message} className="!max-w-none" />
        <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-0">
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
        <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-0">
          <Select
            label="Currency"
            formId="currencyId"
            control={control as Control<any, any>}
            className="!max-w-none"
            options={currencyOptions}
            placeholder="Select currency..."
            error={errors.currencyId && errors.currencyId.message?.toString()}
          />
          <DatePicker
            label="Spent Date"
            date={spentDate}
            setDate={(newDate) => {
              if (newDate) {
                setValue('executedAt', dayjs(newDate).unix());
              }
            }}
            className="[&>button]:w-full"
          />
        </div>
        <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-0">
          <Switch label="Use Account" checked={useAccount} onCheckedChange={setUseAccount} />
          {useAccount && (
            <Select
              label="Spent From"
              formId="accountId"
              control={control as Control<any, any>}
              className="!max-w-none"
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
          onClick={handleSubmit(onSubmitAddNewExpenseForm)}
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

export default AddNewExpenseModal;
