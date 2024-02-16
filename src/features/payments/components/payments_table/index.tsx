import clsx from 'clsx';
import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { RxEnter, RxExit } from 'react-icons/rx';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { useShallow } from 'zustand/react/shallow';
import relativeTime from 'dayjs/plugin/relativeTime';

import { store } from '../../zustand';
import { PaymentsTableRow } from '../../hooks/use_payments_state';
import { Badge, Button, DropdownMenuItem, Table, TableColumnHeader, TableRowActions } from '@components';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface PaymentsTableProps {
  data: PaymentsTableRow[];
  className?: string;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ data, className }) => {
  const { updateOpenAddNewFuturePaymentModal } = store(
    useShallow(({ updateOpenAddNewFuturePaymentModal }) => ({ updateOpenAddNewFuturePaymentModal })),
  );

  return (
    <>
      <div className={clsx('mb-4 mt-2 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between', className)}>
        <h3 className="text-md text-gray-900">Overview</h3>
        <Button
          variant="contained"
          className="h-8 text-xs"
          onClick={() => {
            updateOpenAddNewFuturePaymentModal(true);
          }}
        >
          Add New Payment
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
            accessorKey: 'displayAmount',
            header: ({ column }) => <TableColumnHeader column={column} title="Amount" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('displayAmount')}</div>;
            },
            enableSorting: false,
          },
          {
            accessorKey: 'income',
            header: ({ column }) => <TableColumnHeader column={column} title="Type" />,
            cell: ({ row }) => {
              const income = row.getValue('income');
              return (
                <Badge
                  icon={income ? RxEnter : RxExit}
                  className={clsx(
                    'flex-start flex w-[120px] flex-row items-center justify-center space-x-2 rounded-md px-4 py-1',
                    income ? 'text-green-800' : 'text-red-800',
                    income ? 'bg-green-200' : 'bg-red-200',
                  )}
                >
                  <span className="font-medium capitalize">{income ? 'Income' : 'Expense'}</span>
                </Badge>
              );
            },
            enableSorting: false,
          },
          {
            accessorKey: 'rolling',
            header: ({ column }) => <TableColumnHeader column={column} title="Rolling" />,
            cell: ({ row }) => {
              return row.getValue('rolling') ? (
                <FaCheck className="h-5 w-5 text-green-600" />
              ) : (
                <FaXmark className="h-5 w-5 text-red-600" />
              );
            },
            enableSorting: false,
          },
          {
            accessorKey: 'frequency',
            header: ({ column }) => <TableColumnHeader column={column} title="Frequency" />,
            cell: ({ row }) => {
              return (
                <div className="w-[80px]">
                  {row.getValue('rolling')
                    ? `Every ${dayjs.duration(row.getValue('frequency')).humanize().replaceAll('1 ', '').replaceAll('a ', '')}`
                    : 'N/A'}
                </div>
              );
            },
            enableSorting: false,
          },
          {
            accessorKey: 'scheduledDate',
            header: ({ column }) => <TableColumnHeader column={column} title="Scheduled Date" />,
            cell: ({ row }) => {
              return <div className="w-[120px]">{row.getValue('scheduledDate')}</div>;
            },
            sortingFn: (rowA, rowB) => {
              const rowADate = dayjs(rowA.getValue('scheduledDate'));
              const rowBDate = dayjs(rowB.getValue('scheduledDate'));
              return rowADate.isAfter(rowBDate) ? 1 : rowADate.isSame(rowBDate) ? 0 : -1;
            },
          },
          {
            accessorKey: 'remarks',
            header: ({ column }) => <TableColumnHeader column={column} title="Remarks" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('remarks')}</div>;
            },
            enableSorting: false,
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
                      // populateDeleteExpenseModalState(row.original.id);
                      // updateOpenDeleteExpenseModal(true);
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

export default PaymentsTable;
