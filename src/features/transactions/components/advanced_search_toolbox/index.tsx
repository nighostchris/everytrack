import { z } from 'zod';
import clsx from 'clsx';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { store } from '@features/transactions/zustand';
import { Button, HookedCombobox, Input, Select } from '@components';

const searchCriteriasSchema = z.object({
  search: z.string(),
  categories: z.array(z.string()),
  sorting: z.union([z.literal('date-latest-first'), z.literal('date-oldest-first')]),
});

interface AdvancedSearchToolboxProps {
  clickedApplyAdvancedSearch: (newState: boolean) => void;
  className?: string;
}

export const AdvancedSearchToolbox: React.FC<AdvancedSearchToolboxProps> = ({ clickedApplyAdvancedSearch, className }) => {
  const { updateAdvancedSearchToolboxState } = store(
    useShallow(({ updateAdvancedSearchToolboxState }) => ({ updateAdvancedSearchToolboxState })),
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof searchCriteriasSchema>>({
    defaultValues: {
      search: '',
      categories: [],
      sorting: 'date-latest-first',
    },
    resolver: zodResolver(searchCriteriasSchema),
  });
  const watchSearch = watch('search');
  const watchSorting = watch('sorting');
  const watchCategories = watch('categories');

  const enableResetButton = React.useMemo(
    () => watchSearch.length > 0 || watchSorting !== 'date-latest-first' || watchCategories.length > 0,
    [watchSearch, watchSorting, watchCategories],
  );

  const handleOnClickApplySearchCriteriasButton = async (data: any) => {
    setIsLoading(true);
    const { search, sorting, categories } = data as z.infer<typeof searchCriteriasSchema>;
    updateAdvancedSearchToolboxState({ search, sorting, categories });
    clickedApplyAdvancedSearch(true);
    setIsLoading(false);
  };

  return (
    <div className={clsx('sticky top-0 col-span-1 h-fit rounded-lg bg-white text-gray-800 shadow-lg', className)}>
      <div className="flex flex-row items-center justify-between border border-x-0 border-t-0 border-b-gray-200 px-6 py-4">
        <h2 className="font-medium text-gray-900">Advanced Search</h2>
        {enableResetButton && (
          <p className="text-sm text-blue-400 hover:cursor-pointer" onClick={() => reset()}>
            Reset
          </p>
        )}
      </div>
      <div className="flex flex-col p-6">
        <Input label="Search" formId="search" register={register} className="mb-6 !max-w-none" />
        <Select
          label="Sort By"
          formId="sorting"
          placeholder=""
          control={control as Control<any, any>}
          className="mb-6 !max-w-none"
          options={[
            { value: 'date-latest-first', display: 'Date (latest first)' },
            { value: 'date-oldest-first', display: 'Date (oldest first)' },
          ]}
          error={errors.sorting && errors.sorting.message?.toString()}
        />
        <HookedCombobox
          label="Categories"
          formId="categories"
          placeholder="Select categories..."
          control={control as Control<any, any>}
          groups={{
            Accomodation: [
              { value: 'tax', display: 'Tax' },
              { value: 'transport', display: 'Transport ' },
            ],
            Income: [
              { value: 'tax', display: 'Tax' },
              { value: 'transport', display: 'Transport ' },
            ],
            Testing: [
              { value: 'tax', display: 'Tax' },
              { value: 'transport', display: 'Transport ' },
            ],
          }}
          className="mb-10 !max-w-none"
          error={errors.categories && errors.categories.message?.toString()}
        />
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={handleSubmit(handleOnClickApplySearchCriteriasButton)}
          className="w-full"
        >
          Apply
        </Button>
        {/* <p>Amount</p> */}
        {/* <p>Accounts</p> */}
        {/* <p>Date Range</p> */}
      </div>
    </div>
  );
};

export default AdvancedSearchToolbox;
