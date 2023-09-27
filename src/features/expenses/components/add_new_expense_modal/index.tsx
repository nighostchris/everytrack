/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { store as globalStore } from '@lib/zustand';
import { Button, Dialog, Input, Select, SelectOption } from '@components';
import { createNewExpense, getAllExpenses } from '@api/everytrack_backend';

const addNewExpenseFormSchema = z.object({
  name: z.string(),
  amount: z.string(),
  category: z.union([
    z.literal('entertainment'),
    z.literal('education'),
    z.literal('shopping'),
    z.literal('health'),
    z.literal('dining'),
    z.literal('travel'),
    z.literal('accomodation'),
    z.literal('transportation'),
    z.literal('gift'),
    z.literal('kids'),
    z.literal('groceries'),
    z.literal('bills'),
    z.literal('tax'),
    z.literal('others'),
  ]),
  executedAt: z.number(),
  currencyId: z.string(),
  remarks: z.string().optional(),
  accountId: z.string().optional(),
});

export const AddNewExpenseModal: React.FC = () => {
  const { currencies, updateExpenses } = globalStore();
  const { openAddNewExpenseModal: open, updateOpenAddNewExpenseModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    control,
    register,
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
      executedAt: undefined,
    },
    resolver: zodResolver(addNewExpenseFormSchema),
  });

  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );
  const categoryOptions: SelectOption[] = [
    { value: 'entertainment', display: 'Entertainment' },
    { value: 'education', display: 'Education' },
    { value: 'shopping', display: 'Shopping' },
    { value: 'health', display: 'Health' },
    { value: 'dining', display: 'Dining' },
    { value: 'travel', display: 'Travel' },
    { value: 'accomodation', display: 'Accomodation' },
    { value: 'transportation', display: 'Transportation' },
    { value: 'gift', display: 'Gift' },
    { value: 'kids', display: 'Kids' },
    { value: 'groceries', display: 'Groceries' },
    { value: 'bills', display: 'Bills' },
    { value: 'tax', display: 'Tax' },
    { value: 'others', display: 'Others' },
  ].sort((a, b) => (a.value > b.value ? 1 : -1));

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
      <div className=" bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Expense</h3>
        <Input label="Name" formId="name" register={register} error={errors.name?.message} className="mt-4 !max-w-none" />
        <Input label="Amount" formId="amount" register={register} error={errors.amount?.message} className="mt-4 !max-w-none" />
        <Select
          label="Category"
          formId="category"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={categoryOptions}
          placeholder="Select category..."
          error={errors.category && errors.category.message?.toString()}
        />
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
