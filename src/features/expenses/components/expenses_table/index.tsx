import clsx from 'clsx';
import React from 'react';

import { Button, DropdownMenuItem, Table, TableColumnHeader, TableRowActions } from '@components/index';
import { ExpensesTableRow } from '@features/expenses/hooks/use_expenses_state';

interface ExpensesTableProps {
  data: ExpensesTableRow[];
  className?: string;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({ data, className }) => {
  return (
    <>
      <div className={clsx('mb-4 mt-2 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between', className)}>
        <h3 className="text-md text-gray-900">History</h3>
        <Button
          variant="contained"
          className="h-8 text-xs"
          onClick={() => {
            // updateOpenAddNewStockHoldingModal(true);
            // populateAddNewStockHoldingModalState(id);
          }}
        >
          Add New Expense
        </Button>
      </div>
      <Table
        columns={[
          {
            accessorKey: 'name',
            header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('name')}</div>;
            },
          },
          {
            accessorKey: 'amount',
            header: ({ column }) => <TableColumnHeader column={column} title="Amount" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('amount')}</div>;
            },
            enableSorting: false,
          },
          {
            accessorKey: 'category',
            header: ({ column }) => <TableColumnHeader column={column} title="Category" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('category')}</div>;
            },
            enableSorting: false,
          },
          {
            accessorKey: 'spentDate',
            header: ({ column }) => <TableColumnHeader column={column} title="Spent Date" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('spentDate')}</div>;
            },
          },
          {
            accessorKey: 'remarks',
            header: ({ column }) => <TableColumnHeader column={column} title="Remarks" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('remarks')}</div>;
            },
          },
          {
            id: 'actions',
            cell: ({ row }) => (
              <TableRowActions
                row={row}
                actions={[
                  <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>,
                  <DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>,
                ]}
              />
            ),
          },
        ]}
        data={data}
      />
    </>
  );
};

export default ExpensesTable;
