import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { useStockHoldings, useStocks } from '@hooks';
import { Button, Dialog, Input } from '@components/index';
import { updateStockHolding } from '@api/everytrack_backend';

const editStockHoldingFormSchema = z.object({
  unit: z.string(),
  cost: z.string(),
  stockId: z.string(),
  accountId: z.string(),
});

export const EditStockHoldingCostModal: React.FC = () => {
  const { stocks } = useStocks();
  const {
    unit,
    cost,
    stockId,
    accountId,
    resetEditStockHoldingModalState,
    openEditStockHoldingModal: open,
    updateOpenEditStockHoldingModal: setOpen,
  } = store();
  const { refetch: refetchStockHoldings } = useStockHoldings();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof editStockHoldingFormSchema>>({
    defaultValues: {
      unit: undefined,
      cost: undefined,
      stockId: undefined,
      accountId: undefined,
    },
    resolver: zodResolver(editStockHoldingFormSchema),
  });

  const onSubmitEditStockHoldingCostForm = async (data: any) => {
    setIsLoading(true);
    const { unit, cost, stockId, accountId } = data as z.infer<typeof editStockHoldingFormSchema>;
    try {
      const { success } = await updateStockHolding({ stockId, accountId, unit, cost });
      if (success) {
        setOpen(false);
        resetEditStockHoldingModalState();
        refetchStockHoldings();
        reset();
      }
      setIsLoading(false);
      toast.info('Success!');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const stockName = React.useMemo(() => {
    let name = '';
    if (stocks && stockId) {
      name = stocks.filter(({ id }) => id === stockId)[0].name;
    }
    return name;
  }, [stocks, stockId]);

  React.useEffect(() => {
    reset({ unit, cost, stockId, accountId });
  }, [unit, cost, stockId, accountId]);

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Stock Holding</h3>
        <h4 className="mt-2">{stockName}</h4>
        <Input label="Unit" formId="unit" register={register} error={errors['unit']?.message} className="mt-4 !max-w-none" />
        <Input label="Cost" formId="cost" register={register} error={errors['cost']?.message} className="mt-4 !max-w-none" />
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitEditStockHoldingCostForm)}
          className="w-full sm:ml-2 sm:w-fit"
        >
          Edit
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

export default EditStockHoldingCostModal;
