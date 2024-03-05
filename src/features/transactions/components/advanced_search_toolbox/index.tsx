import { z } from 'zod';
import clsx from 'clsx';
import React from 'react';
import { capitalize } from 'lodash';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Combobox, Input, Select } from '@components';

interface AdvancedSearchToolboxProps {
  className?: string;
}

export const AdvancedSearchToolbox: React.FC<AdvancedSearchToolboxProps> = ({ className }) => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<any>>({
    defaultValues: {
      search: undefined,
      sorting: 'date-latest-first',
    },
  });

  const handleOnClickDeleteAccountButton = React.useCallback(async () => {
    // setIsLoading(true);
    // setIsLoading(false);
  }, [selectedCategories]);

  return (
    <div className="sticky top-0 col-span-1 h-fit rounded-lg bg-white text-gray-800">
      <h2 className="border border-x-0 border-t-0 border-b-gray-200 px-6 py-4 font-medium text-gray-900">Advanced Search</h2>
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
        />
        <Combobox
          label="Categories"
          values={selectedCategories}
          setValues={setSelectedCategories}
          placeholder="Select categories..."
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
        />
        {/* <p>Amount</p> */}
        {/* <p>Accounts</p> */}
        {/* <p>Date Range</p> */}
      </div>
    </div>
  );
};

export default AdvancedSearchToolbox;
