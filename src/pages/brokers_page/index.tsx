/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { AiOutlineRise } from 'react-icons/ai';
import { ToastContainer } from 'react-toastify';
import { ColumnDef } from '@tanstack/react-table';

import { Root } from '@layouts/root';

import 'react-toastify/dist/ReactToastify.css';
import { DataTable } from '@components/table';

interface TestInterface {
  id: string;
  value: number;
}

export const columns: ColumnDef<TestInterface>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <p>Id</p>,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'value',
    header: ({ column }) => <p>Value</p>,
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue('value')}</div>;
    },
  },
];

export const BrokersPage: React.FC = () => {
  return (
    <Root>
      <div className={clsx('relative h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8')}>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Broker Assets</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your broker accounts</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add New Broker
            </button>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 space-x-8">
          <div className="flex flex-col">
            <div className="rounded-lg border border-gray-300 px-6 py-4">
              <h3 className="font-semibold">Total</h3>
              <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-2xl">{`HKD$ 0`}</p>
            </div>
            <div className="mt-6 rounded-lg border border-gray-300 px-6 py-4">
              <h3 className="font-semibold">W / L</h3>
              <div className="mt-1 flex flex-row items-center">
                <AiOutlineRise className="h-6 w-6 font-bold text-green-600" />
                <p className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-2xl text-green-600">{`HKD$ 0`}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-400">Chart to be constructed</div>
        </div>
        <div className="mt-10 flex flex-col">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Stocks</h2>
          <DataTable
            columns={columns}
            data={[
              {
                id: 'TASK-8782',
                value: 10,
              },
              {
                id: 'TASK-7878',
                value: 19,
              },
            ]}
          />
        </div>
      </div>
      <ToastContainer />
    </Root>
  );
};

export default BrokersPage;
