/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { TRANSACTION_CATEGORIES } from '@consts';
import { Currency, TransactionCategory, updateFuturePayment } from '@api/everytrack_backend';
import { useBankAccounts, useBrokerAccounts, useCurrencies, useFuturePayments } from '@hooks';
import { Button, DatePicker, Dialog, HookedInput, RadioGroup, HookedSelect, SelectOption, Switch } from '@components';

export const EditFuturePaymentModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { bankAccounts } = useBankAccounts();
  const { brokerAccounts } = useBrokerAccounts();
  const { futurePayments, refetch: refetchFuturePayments } = useFuturePayments();
  const {
    name,
    open,
    income,
    amount,
    rolling,
    remarks,
    setOpen,
    category,
    frequency,
    accountId,
    currencyId,
    scheduledAt,
    futurePaymentId,
    resetEditFuturePaymentModalState,
  } = store(
    useShallow(
      ({
        name,
        income,
        amount,
        rolling,
        remarks,
        category,
        frequency,
        accountId,
        currencyId,
        scheduledAt,
        futurePaymentId,
        resetEditFuturePaymentModalState,
        openEditFuturePaymentModal: open,
        updateOpenEditFuturePaymentModal: setOpen,
      }) => ({
        open,
        name,
        income,
        amount,
        rolling,
        remarks,
        setOpen,
        category,
        frequency,
        accountId,
        currencyId,
        scheduledAt,
        futurePaymentId,
        resetEditFuturePaymentModalState,
      }),
    ),
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const editFuturePaymentFormSchema = React.useMemo(
    () =>
      z
        .object({
          income: z.boolean(),
          rolling: z.boolean(),
          remarks: z.string().optional(),
          amount: z.coerce
            .number()
            .positive('Amount must be greater than 0')
            .transform((input) => String(input)),
          frequency: z.coerce
            .number()
            .nonnegative('Frequency must not be negative')
            .transform((input) => String(input))
            .optional(),
          name: z.string().min(1, 'Name cannot be empty'),
          accountId: z.string().min(1, 'Account cannot be empty'),
          currencyId: z.string({ required_error: 'Invalid currency' }),
          scheduledAt: z.number({ required_error: 'Invalid schedule date' }),
          futurePaymentId: z.string().min(1, 'Future payment id cannot be empty'),
          category: z.custom<TransactionCategory>((input: unknown) => {
            return typeof input === 'string' && (TRANSACTION_CATEGORIES as unknown as string[]).includes(input);
          }, 'Invalid category'),
        })
        .superRefine((data, ctx) => {
          const { accountId, currencyId } = data;
          if (bankAccounts && accountId && currencyId) {
            const account = bankAccounts.filter(({ id }) => id === accountId)[0];
            if (account.currencyId !== currencyId) {
              ctx.addIssue({
                code: 'custom',
                path: ['currencyId'],
                message: 'Payment currency have to match with bank account currency',
              });
              ctx.addIssue({
                code: 'custom',
                path: ['accountId'],
                message: 'Consider using another account with same currency as this payment',
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
  } = useForm<z.infer<typeof editFuturePaymentFormSchema>>({
    defaultValues: {
      income: false,
      rolling: false,
      name: undefined,
      amount: undefined,
      remarks: undefined,
      category: undefined,
      frequency: undefined,
      accountId: undefined,
      currencyId: undefined,
      scheduledAt: dayjs().startOf('day').add(1, 'day').unix(),
    },
    resolver: zodResolver(editFuturePaymentFormSchema),
  });
  const watchSelectedRolling = watch('rolling');
  const watchSelectedScheduledAt = watch('scheduledAt');

  const futurePaymentName = React.useMemo(
    () => (futurePayments && futurePaymentId ? futurePayments.filter(({ id }) => id === futurePaymentId)[0].name : ''),
    [futurePaymentId],
  );
  const categoryOptions: SelectOption[] = TRANSACTION_CATEGORIES.map((category) => ({
    value: category,
    display: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
  })).sort((a, b) => (a.value > b.value ? 1 : -1));
  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map(({ id, ticker }) => ({ value: id, display: ticker })) : []),
    [currencies],
  );
  const accountOptions: SelectOption[] = React.useMemo(() => {
    if (currencies && bankAccounts && brokerAccounts) {
      const currenciesMap = new Map<string, Currency>();
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      return [
        ...bankAccounts.map(({ id, name, balance, currencyId }) => {
          const currency = (currenciesMap.get(currencyId) as Currency).symbol;
          return { value: id, display: `${name} - ${currency} ${new BigNumber(balance).toFormat(2)}` };
        }),
        ...brokerAccounts.map(({ id, name, balance, currencyId }) => {
          const currency = (currenciesMap.get(currencyId) as Currency).symbol;
          return { value: id, display: `${name} - ${currency} ${new BigNumber(balance).toFormat(2)}` };
        }),
      ].sort((a, b) => a.display.localeCompare(b.display));
    }
    return [];
  }, [currencies, bankAccounts, brokerAccounts]);

  const scheduleDate = React.useMemo(() => dayjs.unix(watchSelectedScheduledAt).toDate(), [watchSelectedScheduledAt]);

  const onSubmitEditAccountBalanceForm = async (data: any) => {
    setIsLoading(true);
    const { name, amount, income, rolling, remarks, category, currencyId, accountId, frequency, scheduledAt, futurePaymentId } =
      data as z.infer<typeof editFuturePaymentFormSchema>;
    try {
      const { success } = await updateFuturePayment({
        name,
        amount,
        category,
        accountId,
        currencyId,
        scheduledAt,
        id: futurePaymentId,
        income: income.toString(),
        rolling: rolling.toString(),
        remarks: remarks && remarks.length > 0 ? remarks : undefined,
        frequency: rolling && frequency ? parseInt(frequency, 10) : undefined,
      });
      if (success) {
        setOpen(false);
        resetEditFuturePaymentModalState();
        refetchFuturePayments();
      }
      setIsLoading(false);
      toast.info('Success!');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    if (
      name &&
      amount &&
      currencyId &&
      category &&
      accountId &&
      scheduledAt &&
      futurePaymentId &&
      typeof income !== 'undefined' &&
      typeof rolling !== 'undefined' &&
      typeof remarks !== 'undefined' &&
      typeof frequency !== 'undefined'
    ) {
      reset({
        name,
        amount,
        income,
        rolling,
        accountId,
        currencyId,
        scheduledAt,
        futurePaymentId,
        frequency: frequency.toString(),
        category: category as TransactionCategory,
        remarks: remarks.length > 0 ? remarks : undefined,
      });
    }
  }, [name, amount, remarks, currencyId, accountId, frequency, scheduledAt, futurePaymentId]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open} className="max-h-[540px] overflow-y-auto md:max-h-none md:max-w-2xl lg:max-w-4xl lg:overflow-visible">
      <div className="space-y-6 rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Future Payment</h3>
        <p className="mt-1 text-sm">{`You are editing details for ${futurePaymentName}`}</p>
        <div className="grid gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-0">
          <HookedInput label="Name" formId="name" register={register} error={errors.name?.message} className="!max-w-none" />
          <HookedInput label="Amount" formId="amount" register={register} error={errors.amount?.message} className="!max-w-none" />
          <HookedSelect
            label="Currency"
            formId="currencyId"
            control={control as Control<any, any>}
            className="!max-w-none"
            options={currencyOptions}
            placeholder="Select currency..."
            error={errors.currencyId && errors.currencyId.message?.toString()}
          />
        </div>
        <div className="grid gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-0">
          <HookedSelect
            label="Account"
            formId="accountId"
            control={control as Control<any, any>}
            className="!max-w-none"
            options={accountOptions}
            placeholder="Select account..."
            error={errors.accountId && errors.accountId.message?.toString()}
          />
          <Switch
            formId="income"
            label="Is it income?"
            control={control as Control<any, any>}
            error={errors.income && errors.income.message?.toString()}
          />
          <Switch
            formId="rolling"
            label="Is it on rolling basis?"
            control={control as Control<any, any>}
            error={errors.rolling && errors.rolling.message?.toString()}
          />
        </div>
        <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-0">
          <DatePicker
            label="Next Payment Schedule Date"
            date={scheduleDate}
            fromDate={dayjs().startOf('day').add(1, 'day').toDate()}
            setDate={(newDate) => {
              if (newDate) {
                setValue('scheduledAt', dayjs(newDate).unix());
              }
            }}
            className="[&>button]:w-full"
          />
          {watchSelectedRolling && (
            <RadioGroup
              label="Frequency"
              control={control as Control<any, any>}
              options={[
                { value: dayjs.duration({ days: 1 }).asSeconds().toString(), display: '1 Day' },
                { value: dayjs.duration({ weeks: 1 }).asSeconds().toString(), display: '1 Week' },
                { value: dayjs.duration({ months: 1 }).asSeconds().toString(), display: '1 Month' },
              ]}
              error={errors.frequency && errors.frequency.message?.toString()}
            />
          )}
        </div>
        <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-0">
          <HookedSelect
            label="Category"
            formId="category"
            control={control as Control<any, any>}
            className="!max-w-none"
            options={categoryOptions}
            placeholder="Select category..."
            error={errors.category && errors.category.message?.toString()}
          />
          <HookedInput
            label="Remarks (optional)"
            formId="remarks"
            register={register}
            error={errors.remarks?.message}
            className="!max-w-none"
          />
        </div>
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

export default EditFuturePaymentModal;
