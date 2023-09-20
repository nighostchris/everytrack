import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { store as globalStore } from '@lib/zustand';
import { Button, Dialog, Input } from '@components/index';
import { getAllStockHoldings, updateStockHolding } from '@api/everytrack_backend';

const editStockHoldingFormSchema = z.object({
  unit: z.string(),
  cost: z.string(),
  stockId: z.string(),
  accountId: z.string(),
});

export const EditStockHoldingCostModal: React.FC = () => {
  const { updateAccountStockHoldings } = globalStore();
  const { unit, cost, stockId, accountId, openEditStockHoldingCostModal: open, updateOpenEditStockHoldingCostModal: setOpen } = store();

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
        const { data } = await getAllStockHoldings();
        updateAccountStockHoldings(data);
        reset();
      }
      setIsLoading(false);
      toast.info('Success!');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    reset({ unit, cost, stockId, accountId });
  }, [unit, cost, stockId, accountId]);

  return (
    <Dialog open={open}>
      <div className=" bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Stock Holding</h3>
        <Input label="Unit" formId="unit" register={register} error={errors['unit']?.message} className="mt-4 !max-w-none" />
        <Input label="Cost" formId="cost" register={register} error={errors['cost']?.message} className="mt-4 !max-w-none" />
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitEditStockHoldingCostForm)}
          className="w-full sm:ml-2 sm:w-fit"
        >
          Submit
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
