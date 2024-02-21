/* eslint-disable max-len */
import React from 'react';
import BigNumber from 'bignumber.js';
import { useShallow } from 'zustand/react/shallow';

import { store } from '@features/savings/zustand';
import { CashTableRecord } from '../../hooks/use_savings_state';

interface CashTableProps {
  data: CashTableRecord[];
}

export const CashTable: React.FC<CashTableProps> = ({ data }) => {
  const {
    updateOpenEditCashModal,
    updateOpenAddNewCashModal,
    updateOpenDeleteCashModal,
    populateEditCashModalState,
    populateDeleteCashModalState,
  } = store(
    useShallow(
      ({
        updateOpenEditCashModal,
        updateOpenAddNewCashModal,
        updateOpenDeleteCashModal,
        populateEditCashModalState,
        populateDeleteCashModalState,
      }) => ({
        updateOpenEditCashModal,
        updateOpenAddNewCashModal,
        updateOpenDeleteCashModal,
        populateEditCashModalState,
        populateDeleteCashModalState,
      }),
    ),
  );

  return (
    <table className="min-w-full">
      <tbody className="bg-white">
        <tr>
          <th colSpan={5} scope="colgroup" className="bg-gray-100 px-4">
            <div className="flex flex-row items-center justify-between py-2">
              <div className="flex h-16 flex-col justify-center">
                <h2 className="text-sm font-normal text-gray-700">Cash Holdings</h2>
              </div>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  updateOpenAddNewCashModal(true);
                }}
                className="text-sm font-medium text-indigo-600 hover:cursor-pointer hover:text-indigo-900"
              >
                Add New Currency
              </a>
            </div>
          </th>
        </tr>
        {data.map(({ id, amount, currency: { id: currencyId, ticker, symbol } }) => (
          <tr key={id} className="border-t border-gray-300">
            <td className="w-1/4 whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{ticker}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`${symbol} ${new BigNumber(amount).toFormat(2)}`}</td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
              <div className="flex flex-row justify-end">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    populateEditCashModalState({ id, amount, currencyId });
                    updateOpenEditCashModal(true);
                  }}
                  className="text-indigo-600 hover:cursor-pointer hover:text-indigo-900"
                >
                  Edit
                </a>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    populateDeleteCashModalState(id);
                    updateOpenDeleteCashModal(true);
                  }}
                  className="ml-4 text-indigo-600 hover:cursor-pointer hover:text-indigo-900"
                >
                  Delete
                </a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CashTable;
