import React from 'react';
import dayjs from 'dayjs';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { DatePicker, Input, Switch } from '@components';

interface AddNewTransactionModalFirstStageProps {
  watch: UseFormWatch<any>;
  control: Control<any, any>;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<{ name: string; amount: string; income: boolean; remarks?: string }>;
}

export const AddNewTransactionModalFirstStage: React.FC<AddNewTransactionModalFirstStageProps> = ({
  watch,
  errors,
  control,
  register,
  setValue,
}) => {
  const watchSelectedExecutedAt = watch('executedAt');

  const executionDate = React.useMemo(() => dayjs.unix(watchSelectedExecutedAt).toDate(), [watchSelectedExecutedAt]);

  return (
    <div className="flex flex-col space-y-6 px-4 pb-6 md:px-6">
      <Input label="Name" formId="name" register={register} error={errors.name?.message} className="!max-w-none" />
      <Input label="Amount" formId="amount" register={register} error={errors.amount?.message} className="!max-w-none" />
      <DatePicker
        label="Execution Date"
        date={executionDate}
        toDate={new Date()}
        setDate={(newDate) => {
          if (newDate) {
            setValue('executedAt', dayjs(newDate).unix());
          }
        }}
        className="[&>button]:w-full"
      />
      <Switch
        formId="income"
        label="Is it income?"
        control={control as Control<any, any>}
        error={errors.income && errors.income.message?.toString()}
      />
      <Input label="Remarks (optional)" formId="remarks" register={register} error={errors.remarks?.message} className="!max-w-none" />
    </div>
  );
};

export default AddNewTransactionModalFirstStage;
