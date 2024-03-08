/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { VscEdit } from 'react-icons/vsc';
import { RxCaretRight } from 'react-icons/rx';
import { useShallow } from 'zustand/react/shallow';
import { IoInformationCircleOutline } from 'react-icons/io5';

import { store } from '../../zustand';
import { BrokerAccount } from '@features/brokers/hooks/use_brokers_state';

interface BrokerAccountHoldingsTableProps {
  data: BrokerAccount;
  className?: string;
}

export const BrokerAccountHoldingsTable: React.FC<BrokerAccountHoldingsTableProps> = ({ data, className }) => {
  const { id: accountId, holdings } = data;
  const {
    // updateOpenDeleteAccountModal,
    updateOpenEditStockHoldingModal,
    // populateDeleteAccountModalState,
    // updateOpenAddNewStockHoldingModal,
    updateOpenDeleteStockHoldingModal,
    // populateEditCashHoldingModalState,
    populateEditStockHoldingModalState,
    // updateOpenEditCashHoldingModalState,
    // populateAddNewStockHoldingModalState,
    populateDeleteStockHoldingModalState,
  } = store(
    useShallow(
      ({
        updateOpenEditStockHoldingModal,
        updateOpenDeleteStockHoldingModal,
        populateEditStockHoldingModalState,
        populateDeleteStockHoldingModalState,
      }) => ({
        updateOpenEditStockHoldingModal,
        updateOpenDeleteStockHoldingModal,
        populateEditStockHoldingModalState,
        populateDeleteStockHoldingModalState,
      }),
    ),
  );

  return (
    <div className={clsx('mt-8 flex flex-col rounded-t-lg bg-white', className)}>
      <div className="flex flex-row justify-between px-8 pt-4">
        <div className="flex flex-row items-center space-x-1">
          <h1 className="text-lg font-semibold text-gray-900">Holdings</h1>
          <span className="group relative">
            <IoInformationCircleOutline className="h-4 w-4" />
            <div className="absolute -left-4 bottom-5 hidden w-44 rounded-md bg-gray-700 px-3 py-2 group-hover:block">
              <p className="text-xs text-gray-200">
                Market prices are provided by <strong>Twelve Data</strong>
              </p>
            </div>
          </span>
        </div>
        <span className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm hover:cursor-pointer">Add New Holding</span>
      </div>
      <table>
        <thead>
          <tr className="grid grid-cols-8 border-b border-b-gray-300 px-8 pb-2 pt-6 text-sm">
            <th className="col-span-3 text-left font-medium">Name</th>
            <th className="col-span-1 text-right font-medium">Price</th>
            <th className="col-span-1 text-right font-medium">Unit</th>
            <th className="col-span-1 text-right font-medium">Cost</th>
            <th className="col-span-1 text-right font-medium">Value</th>
            <th className="col-span-1" />
          </tr>
        </thead>
        <tbody>
          {holdings.map(({ id: stockId, name, unit, cost, ticker, currency: { symbol }, currentPrice }) => (
            <tr className="grid grid-cols-8 px-8 py-4">
              <td className="col-span-3">
                <div className="flex flex-col">
                  <h3 className="font-medium text-gray-900">VOO</h3>
                  <h4 className="text-xs text-gray-500">Vanguard S&P 500 ETF</h4>
                </div>
              </td>
              <td className="col-span-1 flex flex-col items-end justify-center">
                <p className="text-gray-800">{`${symbol}${currentPrice}`}</p>
              </td>
              <td className="col-span-1 flex flex-col items-end justify-center">
                <p className="text-gray-800">{unit}</p>
              </td>
              <td className="col-span-1 flex flex-col items-end justify-center">
                <p className="text-gray-800">{`${symbol}${cost}`}</p>
              </td>
              <td className="col-span-1 flex flex-col items-end justify-center">
                <p className="text-gray-800">{`${symbol}${new BigNumber(currentPrice).multipliedBy(unit).toFormat(2)}`}</p>
              </td>
              <td className="col-span-1 flex flex-row items-center justify-end space-x-3">
                <VscEdit
                  className="h-4 w-4 hover:cursor-pointer"
                  onClick={() => {
                    populateEditStockHoldingModalState({ unit, cost, stockId, accountId });
                    updateOpenEditStockHoldingModal(true);
                  }}
                />
                <span className="flex h-8 w-8 flex-row items-center justify-center rounded-full hover:cursor-pointer hover:border hover:border-gray-300">
                  <RxCaretRight className="h-6 w-6" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrokerAccountHoldingsTable;
