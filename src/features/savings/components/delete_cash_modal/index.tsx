import React from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { Button, Dialog } from '@components';
import { useCash, useCurrencies } from '@hooks';
import { store } from '@features/savings/zustand';
import { deleteCash } from '@api/everytrack_backend';

export const DeleteCashModal: React.FC = () => {
  const { currencies } = useCurrencies();
  const { cash, refetch: refetchCash } = useCash();
  const { cashId, open, setOpen, resetDeleteCashModalState } = store(
    useShallow(({ cashId, openDeleteCashModal: open, updateOpenDeleteCashModal: setOpen, resetDeleteCashModalState }) => ({
      open,
      cashId,
      setOpen,
      resetDeleteCashModalState,
    })),
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const cashHoldingTicker = React.useMemo(() => {
    let displayTicker: string | undefined;
    if (cashId && cash && currencies) {
      const { currencyId } = cash.filter(({ id }) => id === cashId)[0];
      const { ticker } = currencies.filter(({ id }) => id === currencyId)[0];
      displayTicker = ticker;
    }
    return displayTicker;
  }, [cashId, cash, currencies]);

  const handleOnClickDeleteCashButton = React.useCallback(async () => {
    setIsLoading(true);
    if (!cashId) {
      setIsLoading(false);
      toast.error('Unexpected error!');
    } else {
      try {
        const { success } = await deleteCash({ cashId });
        if (success) {
          setOpen(false);
          resetDeleteCashModalState();
          refetchCash();
        }
        setIsLoading(false);
        toast.info('Success!');
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  }, [cashId]);

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Delete Cash Holding</h3>
        <p className="mt-4">{`You are going to delete the cash holding`}</p>
        <p className="mt-2 font-bold">{cashHoldingTicker}</p>
        <p className="mt-2">{`Are you sure about that? 😢`}</p>
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={() => handleOnClickDeleteCashButton()}
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

export default DeleteCashModal;
