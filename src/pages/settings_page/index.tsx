/* eslint-disable max-len */
import { z } from 'zod';
import React from 'react';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';

import { Root } from '@layouts/root';
import { store } from '@lib/zustand';
import { getAllClientSettings, updateSettings } from '@api/everytrack_backend';
import { Input, Select, SelectOption } from '@components';

const updateSettingsSchema = z.object({
  username: z
    .string({
      invalid_type_error: 'Username must be of type string.',
      required_error: 'Username is required.',
    })
    .min(1, {
      message: 'Username must contain at least 1 character.',
    })
    .max(20, {
      message: 'Username must not contain more than 20 characters.',
    }),
  currencyId: z.string(),
});

export const SettingsPage: React.FC = () => {
  const { username, currencyId, currencies, updateClientSettings } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof updateSettingsSchema>>({
    resolver: zodResolver(updateSettingsSchema),
  });

  const currencyOptions: SelectOption[] = React.useMemo(
    () => (currencies ? currencies.map((currency) => ({ value: currency.id, display: currency.ticker })) : []),
    [currencies],
  );

  const onSubmitUpdateSettingsForm = async (data: any) => {
    const { username, currencyId } = data as z.infer<typeof updateSettingsSchema>;
    try {
      const { success } = await updateSettings({ username, currencyId });
      if (success) {
        const { data } = await getAllClientSettings();
        updateClientSettings(data);
      }
      toast('Success!');
    } catch (error: any) {
      console.error(error);
      toast(error.message);
    }
  };

  React.useEffect(() => {
    if (username && currencyId) {
      reset({ username, currencyId });
    }
  }, [username, currencyId]);

  return (
    <Root>
      <div className="flex w-full flex-col p-6 lg:px-10">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <Input label="Username" formId="username" register={register} error={errors['username']?.message} className="mt-4" />
        <Select
          label="Currency"
          formId="currencyId"
          control={control as Control<any, any>}
          className="mt-4"
          options={currencyOptions}
          placeholder="Select currency..."
          error={errors.currencyId && errors.currencyId.message?.toString()}
        />
        <button
          type="button"
          onClick={handleSubmit(onSubmitUpdateSettingsForm)}
          className="mt-8 max-w-sm rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:text-sm"
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </Root>
  );
};

export default SettingsPage;
