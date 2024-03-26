/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { VscEdit } from 'react-icons/vsc';
import { useShallow } from 'zustand/react/shallow';
import { IoIosRemoveCircle } from 'react-icons/io';

import { Button } from '@components';
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
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="text-md w-full bg-white px-6 pb-2 pt-6 font-semibold text-gray-900 md:px-8">Cash Holdings</div>
      <div className="py-2">
        {data.map(({ id, amount, currency: { id: currencyId, ticker, symbol } }, cashIndex) => (
          <div className={clsx('grid grid-cols-8 gap-x-2 px-6 py-4 md:px-8', { 'border-t border-gray-200': cashIndex !== 0 })}>
            <h4 className="col-span-3 text-sm text-gray-900">{ticker}</h4>
            <span className="col-span-3 flex flex-row items-center">
              <h4 className="text-sm text-gray-500">{`${symbol}${new BigNumber(amount).toFormat(2)}`}</h4>
            </span>
            <span className="col-span-2 flex flex-row items-center justify-end space-x-4">
              <VscEdit
                className="h-4 w-4 hover:cursor-pointer"
                onClick={() => {
                  populateEditCashModalState({ id, amount, currencyId });
                  updateOpenEditCashModal(true);
                }}
              />
              <IoIosRemoveCircle
                className="h-4 w-4 text-gray-600 hover:cursor-pointer"
                onClick={() => {
                  populateDeleteCashModalState(id);
                  updateOpenDeleteCashModal(true);
                }}
              />
            </span>
          </div>
        ))}
        <div className="flex flex-col px-6 pb-6 pt-4 md:px-8">
          <Button
            variant="outlined"
            className="w-full text-xs"
            onClick={() => {
              updateOpenAddNewCashModal(true);
            }}
          >
            Add New Currency
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CashTable;
