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
import { Currency, updateFuturePayment } from '@api/everytrack_backend';
import { useBankAccounts, useBrokerAccounts, useCurrencies, useFuturePayments } from '@hooks';
import { Button, DatePicker, Dialog, Input, RadioGroup, Select, SelectOption, Switch } from '@components';

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
        frequency,
        accountId,
        currencyId,
        scheduledAt,
        futurePaymentId,
        resetEditFuturePaymentModalState,
      }),
    ),
  );

  const [isIncome, setIsIncome] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRolling, setIsRolling] = React.useState<boolean>(false);

  const editFuturePaymentFormSchema = React.useMemo(
    () =>
      z
        .object({
          scheduledAt: z.number(),
          remarks: z.string().optional(),
          amount: z.coerce
            .number()
            .positive('Amount must be greater than 0')
            .transform((input) => String(input)),
          frequency: z.coerce
            .number()
            .positive('Frequency must not be negative')
            .transform((input) => String(input))
            .optional(),
          name: z.string().min(1, 'Name cannot be empty'),
          accountId: z.string().min(1, 'Account cannot be empty'),
          currencyId: z.string({ required_error: 'Invalid currency' }),

          futurePaymentId: z.string().min(1, 'Future payment id cannot be empty'),
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
      name: undefined,
      amount: undefined,
      remarks: undefined,
      frequency: undefined,
      accountId: undefined,
      currencyId: undefined,
      scheduledAt: dayjs().startOf('day').add(1, 'day').unix(),
    },
    resolver: zodResolver(editFuturePaymentFormSchema),
  });
  const watchSelectedScheduledAt = watch('scheduledAt');

  const futurePaymentName = React.useMemo(
    () => (futurePayments && futurePaymentId ? futurePayments.filter(({ id }) => id === futurePaymentId)[0].name : ''),
    [futurePaymentId],
  );
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
    const { name, amount, remarks, currencyId, accountId, frequency, scheduledAt, futurePaymentId } = data as z.infer<
      typeof editFuturePaymentFormSchema
    >;
    try {
      const { success } = await updateFuturePayment({
        name,
        amount,
        accountId,
        currencyId,
        scheduledAt,
        id: futurePaymentId,
        income: isIncome.toString(),
        rolling: isRolling.toString(),
        remarks: remarks && remarks.length > 0 ? remarks : undefined,
        frequency: isRolling && frequency ? parseInt(frequency, 10) : undefined,
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
      accountId &&
      scheduledAt &&
      futurePaymentId &&
      typeof remarks !== 'undefined' &&
      typeof frequency !== 'undefined'
    ) {
      reset({
        name,
        amount,
        currencyId,
        accountId,
        scheduledAt,
        futurePaymentId,
        frequency: frequency.toString(),
        remarks: remarks.length > 0 ? remarks : undefined,
      });
    }
  }, [name, amount, remarks, currencyId, accountId, frequency, scheduledAt, futurePaymentId]);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  React.useEffect(() => {
    if (income) {
      setIsIncome(income);
    }
  }, [income]);

  React.useEffect(() => {
    if (rolling) {
      setIsRolling(rolling);
    }
  }, [rolling]);

  return (
    <Dialog open={open} className="max-h-[540px] overflow-y-auto md:max-h-none md:max-w-2xl lg:max-w-4xl lg:overflow-visible">
      <div className="space-y-6 rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Future Payment</h3>
        <p className="mt-1 text-sm">{`You are editing details for ${futurePaymentName}`}</p>
        <div className="grid gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-0">
          <Input label="Name" formId="name" register={register} error={errors.name?.message} className="!max-w-none" />
          <Input label="Amount" formId="amount" register={register} error={errors.amount?.message} className="!max-w-none" />
          <Select
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
          <Select
            label="Account"
            formId="accountId"
            control={control as Control<any, any>}
            className="!max-w-none"
            options={accountOptions}
            placeholder="Select account..."
            error={errors.accountId && errors.accountId.message?.toString()}
          />
          <Switch label="Is it income?" checked={isIncome} onCheckedChange={setIsIncome} />
          <Switch label="Is it on rolling basis?" checked={isRolling} onCheckedChange={setIsRolling} />
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
          {isRolling && (
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
        <Input label="Remarks (optional)" formId="remarks" register={register} error={errors.remarks?.message} className="!max-w-none" />
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
