import clsx from 'clsx';
import React from 'react';

import { store } from '../../zustand';
import { store as globalStore } from '@lib/zustand';
import { BrokerAccountDetails } from '@features/brokers/hooks/use_brokers_state';
import { Button, DropdownMenuItem, Table, TableColumnHeader, TableRowActions } from '@components/index';

interface BrokerAccountTableProps {
  data: BrokerAccountDetails;
  className?: string;
}

export const BrokerAccountTable: React.FC<BrokerAccountTableProps> = ({ data: { id, name, holdings }, className }) => {
  const { stocks } = globalStore();
  const {
    updateOpenDeleteAccountModal,
    updateOpenEditStockHoldingModal,
    populateDeleteAccountModalState,
    updateOpenAddNewStockHoldingModal,
    updateOpenDeleteStockHoldingModal,
    populateEditStockHoldingModalState,
    populateAddNewStockHoldingModalState,
    populateDeleteStockHoldingModalState,
  } = store();

  return (
    <>
      <div className={clsx('mb-4 mt-2 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between', className)}>
        <h3 className="text-md text-gray-900">{name}</h3>
        {stocks && holdings.length < stocks.length && (
          <div className="mt-1 grid w-full grid-cols-2 gap-x-4 sm:mt-0 sm:flex sm:w-fit sm:flex-row">
            <Button
              variant="contained"
              className="h-8 text-xs"
              onClick={() => {
                updateOpenAddNewStockHoldingModal(true);
                populateAddNewStockHoldingModalState(id);
              }}
            >
              Add New Holding
            </Button>
            <Button
              variant="contained"
              className="h-8 text-xs"
              onClick={() => {
                updateOpenDeleteAccountModal(true);
                populateDeleteAccountModalState(id);
              }}
            >
              Delete Account
            </Button>
          </div>
        )}
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
            accessorKey: 'ticker',
            header: ({ column }) => <TableColumnHeader column={column} title="Ticker" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('ticker')}</div>;
            },
          },
          {
            accessorKey: 'currentPrice',
            header: ({ column }) => <TableColumnHeader column={column} title="Current Price" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{`${row.original.currency.symbol} ${row.getValue('currentPrice')}`}</div>;
            },
          },
          {
            accessorKey: 'unit',
            header: ({ column }) => <TableColumnHeader column={column} title="Unit" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{row.getValue('unit')}</div>;
            },
          },
          {
            accessorKey: 'cost',
            header: ({ column }) => <TableColumnHeader column={column} title="Cost" />,
            cell: ({ row }) => {
              return <div className="w-[80px]">{`${row.original.currency.symbol} ${row.getValue('cost')}`}</div>;
            },
          },
          {
            id: 'actions',
            cell: ({ row }) => (
              <TableRowActions
                row={row}
                actions={[
                  <DropdownMenuItem
                    onClick={() => {
                      populateEditStockHoldingModalState({
                        accountId: id,
                        unit: row.original.unit,
                        cost: row.original.cost,
                        stockId: row.original.stockId,
                      });
                      updateOpenEditStockHoldingModal(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>,
                  <DropdownMenuItem
                    onClick={() => {
                      populateDeleteStockHoldingModalState({
                        stockId: row.original.stockId,
                        accountStockId: row.original.id,
                      });
                      updateOpenDeleteStockHoldingModal(true);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>,
                ]}
              />
            ),
          },
        ]}
        data={holdings ?? []}
      />
    </>
  );
};

export default BrokerAccountTable;
