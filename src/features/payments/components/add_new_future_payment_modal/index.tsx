/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { Currency, createNewFuturePayment } from '@api/everytrack_backend';
import { useBankAccounts, useBrokerAccounts, useCurrencies, useFuturePayments } from '@hooks';
import { Button, DatePicker, Dialog, Input, RadioGroup, Select, SelectOption, Switch } from '@components';

export const AddNewFuturePaymentModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { bankAccounts } = useBankAccounts();
  const { brokerAccounts } = useBrokerAccounts();
  const { refetch: refetchFuturePayments } = useFuturePayments();
  const { openAddNewFuturePaymentModal: open, updateOpenAddNewFuturePaymentModal: setOpen } = store();

  const [isIncome, setIsIncome] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRolling, setIsRolling] = React.useState<boolean>(false);

  const addNewFuturePaymentFormSchema = React.useMemo(
    () =>
      z
        .object({
          accountId: z.string(),
          scheduledAt: z.number(),
          remarks: z.string().optional(),
          name: z.string().min(1, 'Name cannot be empty'),
          currencyId: z.string({ required_error: 'Invalid currency' }),
          amount: z.coerce
            .number()
            .positive('Amount must be greater than 0')
            .transform((input) => String(input)),
          frequency: z.coerce.number().positive('Frequency must not be negative').optional(),
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
  } = useForm<z.infer<typeof addNewFuturePaymentFormSchema>>({
    defaultValues: {
      name: undefined,
      amount: undefined,
      remarks: undefined,
      frequency: undefined,
      accountId: undefined,
      currencyId: undefined,
      scheduledAt: dayjs().startOf('day').add(1, 'day').unix(),
    },
    resolver: zodResolver(addNewFuturePaymentFormSchema),
  });
  const watchSelectedScheduledAt = watch('scheduledAt');

  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
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

  const onSubmitAddNewPaymentForm = React.useCallback(
    async (data: any) => {
      setIsLoading(true);
      const { name, amount, frequency, remarks, accountId, currencyId, scheduledAt } = data as z.infer<
        typeof addNewFuturePaymentFormSchema
      >;
      try {
        const { success } = await createNewFuturePayment({
          name,
          amount,
          income: isIncome.toString(),
          rolling: isRolling.toString(),
          frequency,
          remarks,
          accountId,
          currencyId,
          scheduledAt,
        });
        if (success) {
          setOpen(false);
          refetchFuturePayments();
        }
        setIsLoading(false);
        toast.info('Success!');
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message);
      }
    },
    [isIncome, isRolling],
  );

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open} className="max-h-[540px] overflow-y-auto md:max-h-none md:max-w-2xl lg:max-w-4xl lg:overflow-visible">
      <div className="space-y-6 rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Future Payment</h3>
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
                { value: dayjs.duration({ days: 1 }).asMilliseconds().toString(), display: '1 Day' },
                { value: dayjs.duration({ weeks: 1 }).asMilliseconds().toString(), display: '1 Week' },
                { value: dayjs.duration({ months: 1 }).asMilliseconds().toString(), display: '1 Month' },
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
          onClick={handleSubmit(onSubmitAddNewPaymentForm)}
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

export default AddNewFuturePaymentModal;
