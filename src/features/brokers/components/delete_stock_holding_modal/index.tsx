import React from 'react';
import { toast } from 'react-toastify';

import { store } from '../../zustand';
import { Button, Dialog } from '@components';
import { useStockHoldings, useStocks } from '@hooks';
import { deleteStockHolding } from '@api/everytrack_backend';

export const DeleteStockHoldingModal: React.FC = () => {
  const { stocks } = useStocks();
  const {
    stockId,
    accountStockId,
    resetDeleteStockHoldingModalState,
    openDeleteStockHoldingModal: open,
    updateOpenDeleteStockHoldingModal: setOpen,
  } = store();
  const { refetch: refetchStockHoldings } = useStockHoldings();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleOnClickDeleteStockHoldingButton = React.useCallback(async () => {
    setIsLoading(true);
    if (!accountStockId) {
      setIsLoading(false);
      toast.error('Unexpected error!');
    } else {
      try {
        const { success } = await deleteStockHolding({ accountStockId });
        if (success) {
          setOpen(false);
          resetDeleteStockHoldingModalState();
          refetchStockHoldings();
        }
        setIsLoading(false);
        toast.info('Success!');
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  }, [accountStockId]);

  const stockName = React.useMemo(() => {
    let name = '';
    if (stocks && stockId) {
      name = stocks.filter(({ id }) => id === stockId)[0].name;
    }
    return name;
  }, [stocks, stockId]);

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Delete Stock Holding</h3>
        <p className="mt-4">{`Are you sure to delete the stock holding`}</p>
        <p className="mt-2">{stockName}</p>
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={() => handleOnClickDeleteStockHoldingButton()}
          className="w-full bg-red-200 text-red-800 hover:bg-red-300 hover:text-red-900 sm:ml-2 sm:w-28"
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

export default DeleteStockHoldingModal;
