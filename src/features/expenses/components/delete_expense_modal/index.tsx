import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { Button, Dialog, Switch } from '@components';
import { useBankAccounts, useExpenses } from '@hooks';
import { deleteExpense } from '@api/everytrack_backend';

const deleteExpenseFormSchema = z.object({
  revertBalance: z.boolean(),
});

export const DeleteExpenseModal: React.FC = () => {
  const { refetch: refetchBankAccounts } = useBankAccounts();
  const { expenses, refetch: refetchExpenses } = useExpenses();
  const { expenseId, resetDeleteExpenseModalState, openDeleteExpenseModal: open, updateOpenDeleteExpenseModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof deleteExpenseFormSchema>>({
    defaultValues: {
      revertBalance: false,
    },
    resolver: zodResolver(deleteExpenseFormSchema),
  });

  const accountId = React.useMemo(() => {
    if (expenseId && expenses) {
      const { accountId: id } = expenses.filter(({ id }) => id === expenseId)[0];
      if (id !== null) {
        return id;
      }
    }
    return undefined;
  }, [expenseId, expenses]);
  const expenseName = React.useMemo(
    () => (expenses && expenseId ? expenses.filter(({ id }) => id === expenseId)[0].name : ''),
    [expenses, expenseId],
  );

  const onSubmitDeleteExpenseForm = React.useCallback(
    async (data: any) => {
      setIsLoading(true);
      const { revertBalance } = data as z.infer<typeof deleteExpenseFormSchema>;
      if (!expenseId) {
        setIsLoading(false);
        toast.error('Unexpected error!');
      } else {
        try {
          const { success } = await deleteExpense({ expenseId, revertBalance });
          if (success) {
            setOpen(false);
            resetDeleteExpenseModalState();
            refetchBankAccounts();
            refetchExpenses();
          }
          setIsLoading(false);
          toast.info('Success!');
        } catch (error: any) {
          setIsLoading(false);
          toast.error(error.message);
        }
      }
    },
    [expenseId],
  );

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open}>
      <div className="space-y-2 rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Delete Expense</h3>
        <p className="!mt-4">{`Time to get back your money! 🤑🤑`}</p>
        <p className="mt-2">{`Are you sure to delete the expense`}</p>
        <p className="mt-2 font-bold">{expenseName}</p>
        {accountId && (
          <>
            <p>And revert account balance change?</p>
            <Switch
              label=""
              formId="revertBalance"
              control={control as Control<any, any>}
              error={errors.revertBalance && errors.revertBalance.message?.toString()}
            />
          </>
        )}
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitDeleteExpenseForm)}
          className="w-full !bg-red-600 !text-white hover:!bg-red-700 sm:ml-2 sm:w-28"
        >
          Delete
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setOpen(false)}
          className="mt-3 w-full !border-gray-300 !text-gray-700 hover:!bg-gray-200 sm:mt-0 sm:w-28"
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteExpenseModal;
