/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { toast } from 'react-toastify';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '../../zustand';
import { store as globalStore } from '@lib/zustand';
import { Button, Dialog, Input, Select, SelectOption } from '@components';
import { createNewStockHolding, getAllStockHoldings } from '@api/everytrack_backend';

const addNewStockHoldingFormSchema = z.object({
  unit: z.string(),
  cost: z.string(),
  stockId: z.string(),
  accountId: z.string(),
});

export const AddNewStockHoldingModal: React.FC = () => {
  const {
    accountId,
    brokerAccounts,
    resetAddNewStockHoldingModalState,
    openAddNewStockHoldingModal: open,
    updateOpenAddNewStockHoldingModal: setOpen,
  } = store();
  const { stocks, accountStockHoldings, updateAccountStockHoldings } = globalStore();

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

  const accountStockHoldingsMap = React.useMemo(() => {
    const map = new Map<string, string>();
    (accountStockHoldings ?? []).forEach(({ accountId: id, holdings }) => holdings.forEach(({ stockId }) => map.set(stockId, id)));
    return map;
  }, [accountStockHoldings]);
  const accountName = React.useMemo(
    () => (brokerAccounts && accountId ? brokerAccounts.filter(({ id }) => id === accountId)[0].name : ''),
    [accountId, brokerAccounts],
  );
  const stockOptions: SelectOption[] = React.useMemo(
    () =>
      stocks && accountStockHoldings
        ? stocks
            .filter(({ id }) => !accountStockHoldingsMap.get(id))
            .map(({ id, name }) => ({ value: id, display: name }))
            .sort((a, b) => (a.display > b.display ? 1 : -1))
        : [],
    [stocks, accountStockHoldings],
  );

  const onSubmitAddNewStockHoldingForm = async (data: any) => {
    setIsLoading(true);
    const { stockId, accountId, unit, cost } = data as z.infer<typeof addNewStockHoldingFormSchema>;
    try {
      const { success } = await createNewStockHolding({ stockId, accountId, unit, cost });
      if (success) {
        setOpen(false);
        resetAddNewStockHoldingModalState();
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
    reset({ accountId });
  }, [accountId]);

  return (
    <Dialog open={open}>
      <div className=" bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Stock Holding</h3>
        <p className="mt-1 text-sm">{`You are adding stock holding for ${accountName}`}</p>
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

export default AddNewStockHoldingModal;
