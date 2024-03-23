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
import { useBankAccounts, useBrokerAccounts, useCurrencies, useFuturePayments } from '@hooks';
import { Currency, TransactionCategory, createNewFuturePayment } from '@api/everytrack_backend';
import { Button, DatePicker, Dialog, HookedInput, RadioGroup, HookedSelect, SelectOption, Switch } from '@components';

export const AddNewFuturePaymentModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { bankAccounts } = useBankAccounts();
  const { brokerAccounts } = useBrokerAccounts();
  const { refetch: refetchFuturePayments } = useFuturePayments();
  const { openAddNewFuturePaymentModal: open, updateOpenAddNewFuturePaymentModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const addNewFuturePaymentFormSchema = React.useMemo(
    () =>
      z
        .object({
          income: z.boolean(),
          rolling: z.boolean(),
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
  } = useForm<z.infer<typeof addNewFuturePaymentFormSchema>>({
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
    resolver: zodResolver(addNewFuturePaymentFormSchema),
  });
  const watchSelectedRolling = watch('rolling');
  const watchSelectedScheduledAt = watch('scheduledAt');

  const categoryOptions: SelectOption[] = TRANSACTION_CATEGORIES.map((category) => ({
    value: category,
    display: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
  })).sort((a, b) => (a.value > b.value ? 1 : -1));
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

  const onSubmitAddNewPaymentForm = async (data: any) => {
    setIsLoading(true);
    const { name, amount, income, rolling, category, frequency, remarks, accountId, currencyId, scheduledAt } = data as z.infer<
      typeof addNewFuturePaymentFormSchema
    >;
    try {
      const { success } = await createNewFuturePayment({
        name,
        amount,
        remarks,
        category,
        accountId,
        frequency,
        currencyId,
        scheduledAt,
        income: income.toString(),
        rolling: rolling.toString(),
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
  };

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
