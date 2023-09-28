/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { EXPENSE_CATEGORIES } from '@consts';
import { store as globalStore } from '@lib/zustand';
import { Button, DatePicker, Dialog, Input, Select, SelectOption } from '@components';
import { ExpenseCategory, createNewExpense, getAllExpenses } from '@api/everytrack_backend';

const addNewExpenseFormSchema = z.object({
  name: z.string().min(1),
  executedAt: z.number(),
  currencyId: z.string().min(1),
  remarks: z.string().optional(),
  accountId: z.string().optional(),
  amount: z.coerce
    .number()
    .positive()
    .transform((input) => String(input)),
  category: z.custom<ExpenseCategory>((input: unknown) => {
    return typeof input === 'string' && (EXPENSE_CATEGORIES as unknown as string[]).includes(input);
  }, 'Invalid category'),
});

export const AddNewExpenseModal: React.FC = () => {
  const { currencies, updateExpenses } = globalStore();
  const { openAddNewExpenseModal: open, updateOpenAddNewExpenseModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
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

  const spentDate = React.useMemo(() => dayjs.unix(watchSelectedExecutedAt).toDate(), [watchSelectedExecutedAt]);

  const onSubmitAddNewExpenseForm = async (data: any) => {
    setIsLoading(true);
    const { name, amount, remarks, category, accountId, currencyId, executedAt } = data as z.infer<typeof addNewExpenseFormSchema>;
    try {
      const { success } = await createNewExpense({ name, amount, remarks, category, accountId, currencyId, executedAt });
      if (success) {
        setOpen(false);
        const { data } = await getAllExpenses();
        updateExpenses(data);
        reset();
      }
      setIsLoading(false);
      toast.info('Success!');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open}>
      <div className="space-y-6 rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Expense</h3>
        <Input label="Name" formId="name" register={register} error={errors.name?.message} className="!max-w-none" />
        <div className="grid grid-cols-2 gap-x-6">
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
        <div className="grid grid-cols-2 gap-x-6">
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
