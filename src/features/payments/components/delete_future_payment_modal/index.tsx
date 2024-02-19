import React from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { store } from '../../zustand';
import { useFuturePayments } from '@hooks';
import { Button, Dialog } from '@components';
import { deleteFuturePayment } from '@api/everytrack_backend';

export const DeleteFuturePaymentModal: React.FC = () => {
  const { futurePayments, refetch: refetchFuturePayments } = useFuturePayments();
  const { futurePaymentId, open, setOpen, resetDeleteFuturePaymentModalState } = store(
    useShallow(
      ({
        futurePaymentId,
        resetDeleteFuturePaymentModalState,
        openDeleteFuturePaymentModal: open,
        updateOpenDeleteFuturePaymentModal: setOpen,
      }) => ({
        open,
        setOpen,
        futurePaymentId,
        resetDeleteFuturePaymentModalState,
      }),
    ),
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const futurePaymentName = React.useMemo(() => {
    let foundName: string | undefined;
    if (futurePaymentId && futurePayments) {
      const { name } = futurePayments.filter(({ id }) => id === futurePaymentId)[0];
      foundName = name;
    }
    return foundName;
  }, [futurePayments, futurePaymentId]);

  const handleOnClickDeleteFuturePaymentButton = React.useCallback(async () => {
    setIsLoading(true);
    if (!futurePaymentId) {
      setIsLoading(false);
      toast.error('Unexpected error!');
    } else {
      try {
        const { success } = await deleteFuturePayment({ futurePaymentId });
        if (success) {
          setOpen(false);
          resetDeleteFuturePaymentModalState();
          refetchFuturePayments();
        }
        setIsLoading(false);
        toast.info('Success!');
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  }, [futurePaymentId]);

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Delete Future Payment</h3>
        <p className="mt-4">{`You are going to delete the future payment`}</p>
        <p className="mt-2 font-bold">{futurePaymentName}</p>
        <p className="mt-2">{`Are you sure about that? 😢`}</p>
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={() => handleOnClickDeleteFuturePaymentButton()}
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

export default DeleteFuturePaymentModal;
