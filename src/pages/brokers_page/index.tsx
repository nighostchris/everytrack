/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { ResponsivePie } from '@nivo/pie';
import { FaSackDollar } from 'react-icons/fa6';
import { ToastContainer } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import { AiOutlineRise, AiOutlineStock } from 'react-icons/ai';

import 'react-toastify/dist/ReactToastify.css';

import {
  Tabs,
  Table,
  Button,
  StatCard,
  TabsList,
  TabsTrigger,
  TabsContent,
  TableRowActions,
  DropdownMenuItem,
  TableColumnHeader,
} from '@components';
import { Root } from '@layouts/root';
import { store } from '@features/brokers/zustand';
import { store as globalStore } from '@lib/zustand';
import { useBrokersState } from '@features/brokers/hooks/use_brokers_state';
import { AddNewBrokerModal, AddNewStockHoldingModal, EditStockHoldingCostModal } from '@features/brokers/components';

export const BrokersPage: React.FC = () => {
  const { stocks } = globalStore();
  const {
    updateUnit,
    updateCost,
    updateStockId,
    updateAccountId,
    updateOpenAddNewBrokerModal,
    updateOpenAddNewStockHoldingModal,
    updateOpenEditStockHoldingCostModal,
  } = store();
  const { displayCurrency } = useOutletContext<{ displayCurrency: string }>();
  const { isLoading, totalBalance, canAddNewBroker, winLoseAmount, assetDistribution, brokerAccountTableRows } = useBrokersState();

  return (
    <Root>
      <AddNewBrokerModal />
      <AddNewStockHoldingModal />
      <EditStockHoldingCostModal />
      <div className={clsx('relative h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8')}>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Broker Assets</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your broker accounts</p>
          </div>
          {canAddNewBroker && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={() => updateOpenAddNewBrokerModal(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add New Broker
              </button>
            </div>
          )}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
          <div className="flex flex-col space-y-5">
            <StatCard title="Total Balance" icon={FaSackDollar}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${displayCurrency} ${totalBalance}`}</p>
            </StatCard>
            <StatCard title="W / L" icon={AiOutlineStock}>
              <div className="mt-1 flex flex-row items-center">
                <AiOutlineRise
                  className={clsx('h-6 w-6 font-bold', {
                    'text-green-600': new BigNumber(winLoseAmount).isPositive(),
                    'text-red-600': new BigNumber(winLoseAmount).isNegative(),
                  })}
                />
                <p
                  className={clsx('ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-2xl', {
                    'text-green-600': new BigNumber(winLoseAmount).isPositive(),
                    'text-red-600': new BigNumber(winLoseAmount).isNegative(),
                  })}
                >{`${displayCurrency} ${winLoseAmount}`}</p>
              </div>
            </StatCard>
          </div>
          <div className="flex flex-col rounded-lg border border-gray-300 lg:col-span-2">
            <h3 className="p-6 pb-0 text-sm leading-none tracking-tight">Distribution</h3>
            <div className="h-full w-full p-6 pt-0">
              <ResponsivePie
                // @ts-ignore
                data={assetDistribution}
                padAngle={0.7}
                borderWidth={1}
                cornerRadius={3}
                innerRadius={0.5}
                arcLabelsSkipAngle={10}
                arcLinkLabelsThickness={2}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLabel={(item) => `${item.value}%`}
                arcLinkLabelsColor={{ from: 'color' }}
                margin={{ top: 30, right: 20, bottom: 30, left: 20 }}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              />
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <h2 className="text-lg font-medium text-gray-900">Stocks</h2>
          {brokerAccountTableRows.length > 0 && (
            <Tabs defaultValue={brokerAccountTableRows[0].id} className="mt-2 space-y-4">
              <TabsList>
                {brokerAccountTableRows.map(({ id, name }) => (
                  <TabsTrigger value={id}>{name}</TabsTrigger>
                ))}
              </TabsList>
              {brokerAccountTableRows.map(({ id: providerId, accounts }) => (
                <TabsContent value={providerId}>
                  {accounts.map(({ id: accountId, name, holdings }) => (
                    <>
                      <div className="mb-4 mt-2 flex flex-row items-center justify-between">
                        <h3 className="text-md text-gray-900">{name}</h3>
                        {stocks && holdings.length < stocks.length && (
                          <Button
                            variant="contained"
                            className="h-8 text-xs"
                            onClick={() => {
                              updateOpenAddNewStockHoldingModal(true);
                              updateAccountId(accountId);
                            }}
                          >
                            Add New Holding
                          </Button>
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
                                      updateAccountId(accountId);
                                      updateCost(row.original.cost);
                                      updateUnit(row.original.unit);
                                      updateStockId(row.original.stockId);
                                      updateOpenEditStockHoldingCostModal(true);
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>,
                                ]}
                              />
                            ),
                          },
                        ]}
                        data={holdings ?? []}
                      />
                    </>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
      <ToastContainer />
    </Root>
  );
};

export default BrokersPage;
