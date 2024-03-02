import clsx from 'clsx';
import React from 'react';
import dayjs from 'dayjs';
import { useShallow } from 'zustand/react/shallow';

import { store } from '../../zustand';
import ExpenseCategoryBadge from '../transaction_category_badge';
import { TransactionsTableRow } from '../../hooks/use_transactions_state';
import { Button, DropdownMenuItem, Table, TableColumnHeader, TableRowActions } from '@components/index';

interface TransactionsTableProps {
  data: TransactionsTableRow[];
  className?: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ data, className }) => {
  const { populateDeleteTransactionModalState, updateOpenAddNewTransactionModal, updateOpenDeleteTransactionModal } = store(
    useShallow(({ populateDeleteTransactionModalState, updateOpenAddNewTransactionModal, updateOpenDeleteTransactionModal }) => ({
      populateDeleteTransactionModalState,
      updateOpenAddNewTransactionModal,
      updateOpenDeleteTransactionModal,
    })),
  );

  return (
    <>
      <div className={clsx('mb-4 mt-2 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between', className)}>
        <h3 className="text-md text-gray-900">History</h3>
        <Button
          variant="contained"
          className="h-8 text-xs"
          onClick={() => {
            updateOpenAddNewTransactionModal(true);
          }}
        >
          Add New Transaction
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
              return <ExpenseCategoryBadge category={row.getValue('category')} />;
            },
            enableSorting: false,
          },
          {
            accessorKey: 'executionDate',
            header: ({ column }) => <TableColumnHeader column={column} title="Execution Date" />,
            cell: ({ row }) => {
              return <div className="w-[120px]">{row.getValue('executionDate')}</div>;
            },
            sortingFn: (rowA, rowB) => {
              const rowADate = dayjs(rowA.getValue('executionDate'));
              const rowBDate = dayjs(rowB.getValue('executionDate'));
              return rowADate.isAfter(rowBDate) ? 1 : rowADate.isSame(rowBDate) ? 0 : -1;
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
                  // <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>,
                  <DropdownMenuItem
                    onClick={() => {
                      populateDeleteTransactionModalState(row.original.id);
                      updateOpenDeleteTransactionModal(true);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>,
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

export default TransactionsTable;
