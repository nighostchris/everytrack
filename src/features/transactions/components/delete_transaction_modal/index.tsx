import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { Button, Dialog, Switch } from '@components';
import { useBankAccounts, useTransactions } from '@hooks';
import { deleteTransaction } from '@api/everytrack_backend';

const deleteTransactionFormSchema = z.object({
  revertBalance: z.boolean(),
});

export const DeleteTransactionModal: React.FC = () => {
  const { refetch: refetchBankAccounts } = useBankAccounts();
  const { transactions, refetch: refetchTransactions } = useTransactions();
  const { open, income, setOpen, transactionId, resetDeleteTransactionModalState } = store(
    useShallow(
      ({
        income,
        transactionId,
        resetDeleteTransactionModalState,
        openDeleteTransactionModal: open,
        updateOpenDeleteTransactionModal: setOpen,
      }) => ({
        open,
        income,
        setOpen,
        transactionId,
        resetDeleteTransactionModalState,
      }),
    ),
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof deleteTransactionFormSchema>>({
    defaultValues: {
      revertBalance: false,
    },
    resolver: zodResolver(deleteTransactionFormSchema),
  });

  const accountId = React.useMemo(() => {
    if (transactionId && transactions) {
      const { accountId: id } = transactions.filter(({ id }) => id === transactionId)[0];
      if (id !== null) {
        return id;
      }
    }
    return undefined;
  }, [transactionId, transactions]);
  const transactionName = React.useMemo(
    () => (transactions && transactionId ? transactions.filter(({ id }) => id === transactionId)[0].name : ''),
    [transactions, transactionId],
  );

  const onSubmitDeleteTransactionForm = React.useCallback(
    async (data: any) => {
      setIsLoading(true);
      const { revertBalance } = data as z.infer<typeof deleteTransactionFormSchema>;
      if (!transactionId) {
        setIsLoading(false);
        toast.error('Unexpected error!');
      } else {
        try {
          const { success } = await deleteTransaction({ transactionId, revertBalance });
          if (success) {
            setOpen(false);
            resetDeleteTransactionModalState();
            refetchBankAccounts();
            refetchTransactions();
          }
          setIsLoading(false);
          toast.info('Success!');
        } catch (error: any) {
          setIsLoading(false);
          toast.error(error.message);
        }
      }
    },
    [transactionId],
  );

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={open}>
      <div className="space-y-2 rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Delete Transaction</h3>
        <p className="!mt-4">{income ? `Time to return your money! 😢😢` : `Time to get back your money! 🤑🤑`}</p>
        <p className="mt-2">{`Are you sure to delete the transaction`}</p>
        <p className="mt-2 font-bold">{transactionName}</p>
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
          onClick={handleSubmit(onSubmitDeleteTransactionForm)}
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

export default DeleteTransactionModal;
