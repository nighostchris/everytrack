/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { AiOutlineRise } from 'react-icons/ai';
import { ToastContainer } from 'react-toastify';
import { ColumnDef } from '@tanstack/react-table';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
import { Stock } from '@api/everytrack_backend';
import { store } from '@features/brokers/zustand';
import { store as globalStore } from '@lib/zustand';
import { DropdownMenuItem } from '@components/dropdown_menu';
import { useBrokersState } from '@features/brokers/hooks/use_brokers_state';
import { Button, Table, TableRowActions, TableColumnHeader } from '@components';
import { AddNewBrokerModal, AddNewStockHoldingModal } from '@features/brokers/components';

interface AccountStockHoldingTableRow {
  unit: string;
  cost: string;
  name: string;
  ticker: string;
  currentPrice: string;
}

export const columns: ColumnDef<AccountStockHoldingTableRow>[] = [
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
      return <div className="w-[80px]">{row.getValue('currentPrice')}</div>;
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
      return <div className="w-[80px]">{row.getValue('cost')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <TableRowActions row={row} actions={[<DropdownMenuItem>Edit</DropdownMenuItem>]} />,
  },
];

export const BrokersPage: React.FC = () => {
  const { isLoading } = useBrokersState();
  const {
    stocks,
    brokerDetails,
    brokerAccounts,
    accountStockHoldings,
    updateAccountId,
    updateOpenAddNewBrokerModal,
    updateOpenAddNewStockHoldingModal,
  } = store();
  const { currencyId, currencies, exchangeRates } = globalStore();

  const stocksTableTitleMap = React.useMemo(() => {
    const map: { [accountTypeId: string]: { icon: string; title: string } } = {};
    if (brokerDetails) {
      brokerDetails.forEach(({ name, icon, accountTypes }) => {
        accountTypes.forEach(({ id, name: accountTypeName }) => {
          map[id] = { icon, title: `${name} - ${accountTypeName}` };
        });
      });
    }
    return map;
  }, [brokerDetails, brokerAccounts]);

  const constructAccountStockHoldingTableRowMap = React.useMemo(() => {
    const stocksMap: { [id: string]: Stock } = {};
    const map: { [accountId: string]: AccountStockHoldingTableRow[] } = {};
    if (stocks && brokerAccounts && accountStockHoldings) {
      stocks.forEach((stock) => (stocksMap[stock.id] = stock));
      accountStockHoldings.forEach(({ accountId, holdings }) => {
        map[accountId] = [];
        holdings.forEach(({ unit, cost, stockId }) => {
          const { name, ticker, currentPrice } = stocksMap[stockId];
          map[accountId].push({ name, ticker, currentPrice, unit, cost });
        });
      });
    }
    return map;
  }, [stocks, brokerAccounts, accountStockHoldings]);

  const displayCurrency = React.useMemo(
    () => (currencies && currencyId ? currencies.filter(({ id }) => id === currencyId)[0].symbol : ''),
    [currencyId, currencies],
  );

  const totalBalance = React.useMemo(() => {
    if (!accountStockHoldings || !exchangeRates || !currencyId || !stocks) return '0';
    const stocksMap: { [id: string]: Stock } = {};
    stocks.forEach((stock) => (stocksMap[stock.id] = stock));
    let totalBalance = new BigNumber(0);
    accountStockHoldings.forEach(({ holdings }) => {
      holdings.forEach(({ unit, cost, stockId }) => {
        const { currencyId: stockCurrencyId } = stocksMap[stockId];
        if (stockCurrencyId === currencyId) {
          totalBalance = totalBalance.plus(new BigNumber(unit).multipliedBy(cost));
        } else {
          const exchangeRate = exchangeRates.filter(
            ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === stockCurrencyId && targetCurrencyId === currencyId,
          )[0];
          const convertedBalance = new BigNumber(unit).multipliedBy(cost).multipliedBy(exchangeRate.rate);
          totalBalance = totalBalance.plus(convertedBalance);
        }
      });
    });
    return totalBalance.toFormat(2);
  }, [stocks, currencyId, exchangeRates, accountStockHoldings]);

  const winLoseAmount = React.useMemo(() => {
    if (!accountStockHoldings || !exchangeRates || !currencyId || !stocks) return '0';
    const stocksMap: { [id: string]: Stock } = {};
    stocks.forEach((stock) => (stocksMap[stock.id] = stock));
    let amount = new BigNumber(0);
    accountStockHoldings.forEach(({ holdings }) => {
      holdings.forEach(({ unit, cost, stockId }) => {
        const { currentPrice, currencyId: stockCurrencyId } = stocksMap[stockId];
        if (stockCurrencyId === currencyId) {
          amount = amount.plus(new BigNumber(unit).multipliedBy(new BigNumber(currentPrice).minus(cost)));
        } else {
          const exchangeRate = exchangeRates.filter(
            ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === stockCurrencyId && targetCurrencyId === currencyId,
          )[0];
          const convertedBalance = new BigNumber(unit)
            .multipliedBy(new BigNumber(currentPrice).minus(cost))
            .multipliedBy(exchangeRate.rate);
          amount = amount.plus(convertedBalance);
        }
      });
    });
    return amount.toFormat(2);
  }, [stocks, currencyId, exchangeRates, accountStockHoldings]);

  return (
    <Root>
      <AddNewBrokerModal />
      <AddNewStockHoldingModal />
      <div className={clsx('relative h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8')}>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Broker Assets</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your broker accounts</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => updateOpenAddNewBrokerModal(true)}
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
              <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-2xl">{`${displayCurrency} ${totalBalance}`}</p>
            </div>
            <div className="mt-6 rounded-lg border border-gray-300 px-6 py-4">
              <h3 className="font-semibold">W / L</h3>
              <div className="mt-1 flex flex-row items-center">
                <AiOutlineRise className="h-6 w-6 font-bold text-green-600" />
                <p
                  className={clsx('ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-2xl text-green-600')}
                >{`${displayCurrency} ${winLoseAmount}`}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-400">Chart to be constructed</div>
        </div>
        <div className="mt-10 flex flex-col">
          <h2 className="text-lg font-medium text-gray-900">Stocks</h2>
          {brokerDetails &&
            brokerAccounts &&
            brokerAccounts.map(({ id, accountTypeId }) => (
              <>
                <div className="flex flex-row items-center justify-between">
                  <h3 className="text-md my-4 text-gray-900">{stocksTableTitleMap[accountTypeId].title}</h3>
                  <Button
                    variant="contained"
                    className="h-8 text-xs"
                    onClick={() => {
                      updateOpenAddNewStockHoldingModal(true);
                      updateAccountId(id);
                    }}
                  >
                    Add New Holding
                  </Button>
                </div>
                <Table columns={columns} data={constructAccountStockHoldingTableRowMap[id] ?? []} />
              </>
            ))}
        </div>
      </div>
      <ToastContainer />
    </Root>
  );
};

export default BrokersPage;
