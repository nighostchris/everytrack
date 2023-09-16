/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { createNewStockHolding } from '@api/everytrack_backend';
import { Button, Dialog, Input, Select, SelectOption } from '@components';

const addNewStockHoldingFormSchema = z.object({
  unit: z.string(),
  cost: z.string(),
  stockId: z.string(),
  accountId: z.string(),
});

export const AddNewStockHoldingModal: React.FC = () => {
  const { stocks, accountId, openAddNewStockHoldingModal: open, updateOpenAddNewStockHoldingModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof addNewStockHoldingFormSchema>>({
    defaultValues: {
      unit: undefined,
      cost: undefined,
      stockId: undefined,
      accountId: undefined,
    },
    resolver: zodResolver(addNewStockHoldingFormSchema),
  });
  const watchSelectedStock = watch('stockId');

  const stockOptions: SelectOption[] = React.useMemo(
    () => (stocks ? stocks.map(({ id, name }) => ({ value: id, display: name })).sort((a, b) => (a.display > b.display ? 1 : -1)) : []),
    [stocks],
  );

  const onSubmitAddNewStockHoldingForm = async (data: any) => {
    setIsLoading(true);
    const { stockId, accountId, unit, cost } = data as z.infer<typeof addNewStockHoldingFormSchema>;
    try {
      const { success } = await createNewStockHolding({ stockId, accountId, unit, cost });
      if (success) {
        // TODO: reset form state
        setOpen(false);
      }
      setIsLoading(false);
      toast.info('Success!');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    reset({ accountId });
  }, [accountId]);

  return (
    <Dialog open={open}>
      <div className=" bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Stock Holding</h3>
        <Select
          label="Stock"
          formId="stockId"
          control={control as Control<any, any>}
          className="mt-4 !max-w-none"
          options={stockOptions}
          placeholder="Select stock..."
          error={errors.stockId && errors.stockId.message?.toString()}
        />
        {watchSelectedStock && (
          <>
            <Input label="Unit" formId="unit" register={register} error={errors['unit']?.message} className="mt-4 !max-w-none" />
            <Input label="Cost" formId="cost" register={register} error={errors['cost']?.message} className="mt-4 !max-w-none" />
          </>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitAddNewStockHoldingForm)}
          className="w-full sm:ml-2 sm:w-fit"
        >
          Submit
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
};

export default AddNewStockHoldingModal;
