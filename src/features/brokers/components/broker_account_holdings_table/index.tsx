/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { VscEdit } from 'react-icons/vsc';
import { RxCaretRight } from 'react-icons/rx';
import { IoIosRemoveCircle } from 'react-icons/io';
import { useShallow } from 'zustand/react/shallow';
import { IoInformationCircleOutline } from 'react-icons/io5';

import { store } from '../../zustand';
import { BrokerAccount } from '@features/brokers/hooks/use_brokers_state';

interface BrokerAccountHoldingsTableProps {
  data: BrokerAccount;
  className?: string;
}

export const BrokerAccountHoldingsTable: React.FC<BrokerAccountHoldingsTableProps> = ({ data, className }) => {
  const { id: accountId, name, balance, currency, holdings, accountTypeId } = data;
  const {
    updateOpenDeleteAccountModal,
    populateDeleteAccountModalState,
    updateOpenEditStockHoldingModal,
    updateOpenAddNewStockHoldingModal,
    updateOpenDeleteStockHoldingModal,
    populateEditCashHoldingModalState,
    populateEditStockHoldingModalState,
    updateOpenEditCashHoldingModalState,
    populateAddNewStockHoldingModalState,
    populateDeleteStockHoldingModalState,
  } = store(
    useShallow(
      ({
        updateOpenDeleteAccountModal,
        populateDeleteAccountModalState,
        updateOpenEditStockHoldingModal,
        updateOpenAddNewStockHoldingModal,
        updateOpenDeleteStockHoldingModal,
        populateEditCashHoldingModalState,
        populateEditStockHoldingModalState,
        updateOpenEditCashHoldingModalState,
        populateAddNewStockHoldingModalState,
        populateDeleteStockHoldingModalState,
      }) => ({
        updateOpenDeleteAccountModal,
        populateDeleteAccountModalState,
        updateOpenEditStockHoldingModal,
        updateOpenAddNewStockHoldingModal,
        updateOpenDeleteStockHoldingModal,
        populateEditCashHoldingModalState,
        populateEditStockHoldingModalState,
        updateOpenEditCashHoldingModalState,
        populateAddNewStockHoldingModalState,
        populateDeleteStockHoldingModalState,
      }),
    ),
  );

  return (
    <div className={clsx('flex flex-col rounded-lg bg-white shadow-sm', className)}>
      <div className="flex flex-col space-y-2 px-6 pt-4 md:flex-row md:justify-between md:space-y-0 md:px-8">
        <div className="flex flex-row items-center space-x-1">
          <h1 className="text-lg font-semibold text-gray-900">{`Holdings - ${name}`}</h1>
          <span className="group relative">
            <IoInformationCircleOutline className="h-4 w-4" />
            <div className="absolute -left-4 bottom-5 hidden w-44 rounded-md bg-gray-700 px-3 py-2 group-hover:block">
              <p className="text-xs text-gray-200">
                Market prices are provided by <strong>Twelve Data</strong>
              </p>
            </div>
          </span>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <span
            className="rounded-lg border border-gray-200 px-3 py-2 text-center text-xs shadow-sm hover:cursor-pointer md:text-left"
            onClick={() => {
              populateAddNewStockHoldingModalState(accountId);
              updateOpenAddNewStockHoldingModal(true);
            }}
          >
            Add New Holding
          </span>
          <span
            className="rounded-lg border border-gray-200 px-3 py-2 text-center text-xs shadow-sm hover:cursor-pointer md:text-left"
            onClick={() => {
              populateDeleteAccountModalState(accountId);
              updateOpenDeleteAccountModal(true);
            }}
          >
            Delete Account
          </span>
        </div>
      </div>
      <table className="mt-6 md:mt-0">
        <thead>
          <tr className="hidden grid-cols-8 px-8 pb-2 pt-6 text-sm md:grid">
            <th className="col-span-3 text-left font-medium">Name</th>
            <th className="col-span-1 text-right font-medium">Price</th>
            <th className="col-span-1 text-right font-medium">Unit</th>
            <th className="col-span-1 text-right font-medium">Cost</th>
            <th className="col-span-1 text-right font-medium">Value</th>
            <th className="col-span-1" />
          </tr>
        </thead>
        <tbody>
          <span className="flex w-full flex-row bg-gray-200 px-6 py-2 md:px-8">
            <h3 className="text-xs font-medium text-gray-500">Cash</h3>
          </span>
          <tr className="grid grid-cols-8 px-6 py-4 md:px-8">
            <td className="col-span-3 flex flex-row items-center">
              <h3 className="font-medium text-gray-900">{currency.ticker}</h3>
            </td>
            <td className="hidden md:col-span-1 md:table-cell" />
            <td className="hidden md:col-span-1 md:table-cell" />
            <td className="hidden md:col-span-1 md:table-cell" />
            <td className="col-span-3 flex flex-col items-end justify-center md:col-span-1">
              <p className="text-sm text-gray-800 md:text-base">{`${currency.symbol}${balance}`}</p>
            </td>
            <td className="col-span-2 flex flex-row items-center justify-end space-x-2 md:col-span-1 md:space-x-3">
              <VscEdit
                className="h-4 w-4 hover:cursor-pointer"
                onClick={() => {
                  populateEditCashHoldingModalState({ balance, currencyId: currency.id, accountTypeId });
                  updateOpenEditCashHoldingModalState(true);
                }}
              />
              <span className="flex h-5 w-5 flex-row items-center justify-center rounded-full hover:cursor-pointer md:h-8 md:w-8 md:hover:border md:hover:border-gray-300">
                <RxCaretRight className="h-5 w-5 md:h-6 md:w-6" />
              </span>
            </td>
          </tr>
          <span className="flex w-full flex-row bg-gray-200 px-6 py-2 md:px-8">
            <h3 className="text-xs font-medium text-gray-500">Stocks</h3>
          </span>
          {holdings.length === 0 && (
            <div className="flex w-full flex-col items-center px-8 py-12 text-center md:text-left">
              <h1 className="text-xl leading-7 text-gray-600">Oops! 😢😢</h1>
              <p className="mt-6 text-sm leading-7 text-gray-600">You don't seems to own any stocks 💸💸💸</p>
              <p className="text-sm leading-7 text-gray-600">Just click the button in top right corner to add your holdings!</p>
            </div>
          )}
          {holdings.map(({ id, name, unit, cost, stockId, ticker, currency: { symbol }, currentPrice }) => (
            <tr className="grid grid-cols-8 px-6 py-4 md:px-8">
              <td className="col-span-3">
                <div className="flex flex-col">
                  <h3 className="font-medium text-gray-900">{ticker}</h3>
                  <h4 className="text-xs text-gray-500">{name}</h4>
                  <h4 className="text-xs leading-relaxed text-gray-400 md:hidden">{`${unit} x ${symbol}${cost}`}</h4>
                  <h4 className="text-xs text-gray-400 md:hidden">{`${symbol}${currentPrice}`}</h4>
                </div>
              </td>
              <td className="hidden flex-col items-end justify-center md:col-span-1 md:flex">
                <p className="text-gray-800">{`${symbol}${currentPrice}`}</p>
              </td>
              <td className="hidden flex-col items-end justify-center md:col-span-1 md:flex">
                <p className="text-gray-800">{unit}</p>
              </td>
              <td className="hidden flex-col items-end justify-center md:col-span-1 md:flex">
                <p className="text-gray-800">{`${symbol}${cost}`}</p>
              </td>
              <td className="col-span-3 flex flex-col items-end justify-center md:col-span-1">
                <p className="text-sm text-gray-800 md:text-base">{`${symbol}${new BigNumber(currentPrice).multipliedBy(unit).toFormat(2)}`}</p>
              </td>
              <td className="col-span-2 flex flex-row items-center justify-end space-x-2 md:col-span-1 md:space-x-3">
                <VscEdit
                  className="h-4 w-4 hover:cursor-pointer"
                  onClick={() => {
                    populateEditStockHoldingModalState({ unit, cost, stockId, accountId });
                    updateOpenEditStockHoldingModal(true);
                  }}
                />
                <IoIosRemoveCircle
                  className="h-4 w-4 text-gray-600 hover:cursor-pointer"
                  onClick={() => {
                    populateDeleteStockHoldingModalState({ stockId, accountStockId: id });
                    updateOpenDeleteStockHoldingModal(true);
                  }}
                />
                <span className="flex h-5 w-5 flex-row items-center justify-center rounded-full hover:cursor-pointer md:h-8 md:w-8 md:hover:border md:hover:border-gray-300">
                  <RxCaretRight className="h-5 w-5 md:h-6 md:w-6" />
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
