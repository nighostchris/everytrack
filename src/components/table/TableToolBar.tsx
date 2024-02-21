/* eslint-disable max-len */
import React from 'react';
import { Table } from '@tanstack/react-table';

// import { Cross2Icon } from '@radix-ui/react-icons';

// import { Button } from '@/registry/new-york/ui/button';
// import { Input } from '@/registry/new-york/ui/input';
// import { DataTableViewOptions } from '@/app/examples/tasks/components/data-table-view-options';

// import { priorities, statuses } from '../data/data';
// import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface TableToolBarProps<Data> {
  table: Table<Data>;
}

export function TableToolBar<Data>({ table }: TableToolBarProps<Data>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <input
          type="text"
          placeholder="Search record..."
          value={table.getState().globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="h-9 w-full rounded-md border-gray-300 px-3 py-1 focus:border-none focus:outline-none focus:ring-1 focus:ring-gray-500 sm:text-sm"
        />
        {/* {table.getColumn('status') && <DataTableFacetedFilter column={table.getColumn('status')} title="Status" options={statuses} />}
        {table.getColumn('priority') && (
          <DataTableFacetedFilter column={table.getColumn('priority')} title="Priority" options={priorities} />
        )} */}
        {/* {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )} */}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
