/* eslint-disable max-len */
import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import 'react-toastify/dist/ReactToastify.css';
import './calendar.css';

import { Root } from '@layouts/root';
import { store } from '@features/payments/zustand';
import { usePaymentsState } from '@features/payments/hooks/use_payments_state';
import { PaymentsTable, AddNewFuturePaymentModal, DeleteFuturePaymentModal, EditFuturePaymentModal } from '@features/payments/components';

const localizer = dayjsLocalizer(dayjs);
const DragAndDropCalendar = withDragAndDrop(Calendar);

export const PaymentsPage: React.FC = () => {
  const { openAddNewFuturePaymentModal, openEditFuturePaymentModal, openDeleteFuturePaymentModal } = store(
    useShallow(({ openAddNewFuturePaymentModal, openEditFuturePaymentModal, openDeleteFuturePaymentModal }) => ({
      openEditFuturePaymentModal,
      openAddNewFuturePaymentModal,
      openDeleteFuturePaymentModal,
    })),
  );
  // const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const { error: paymentsStateError, paymentsTableRows } = usePaymentsState();

  return (
    <Root>
      <EditFuturePaymentModal />
      <AddNewFuturePaymentModal />
      <DeleteFuturePaymentModal />
      <div
        className={clsx('relative flex h-full flex-col overflow-y-auto px-8 py-6', {
          'z-0': openAddNewFuturePaymentModal || openEditFuturePaymentModal || openDeleteFuturePaymentModal,
          'z-10': !openAddNewFuturePaymentModal && !openEditFuturePaymentModal && !openDeleteFuturePaymentModal,
        })}
      >
        <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
        <p className="mt-2 text-sm text-gray-700">Monitor your rolling incomes and subscriptions</p>
        {/* Constructions on going */}
        <div className="mt-10 min-h-[632px] w-full rounded-lg bg-white pb-8">
          <DragAndDropCalendar
            views={['month']}
            defaultView="month"
            localizer={localizer}
            formats={{
              dateFormat: 'D',
            }}
            components={{
              toolbar: (props) => {
                console.log(props);
                return (
                  <div className="flex flex-row items-center justify-between border-b border-b-gray-200 px-6 py-4">
                    <h2 className="text-lg font-medium">{dayjs(props.date).format('MMMM YYYY')}</h2>
                    <div className="flex flex-row items-center space-x-6">
                      <span className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm hover:cursor-pointer">Today</span>
                      <FaArrowLeft
                        className="h-5 w-5 hover:cursor-pointer"
                        onClick={() => {
                          props.onNavigate('PREV');
                        }}
                      />
                      <FaArrowRight
                        className="h-5 w-5 hover:cursor-pointer"
                        onClick={() => {
                          props.onNavigate('NEXT');
                        }}
                      />
                    </div>
                  </div>
                );
              },
            }}
          />
        </div>
        {/* Constructions on going */}
        <PaymentsTable data={paymentsTableRows} className="!mt-10" />
      </div>
      <ToastContainer />
    </Root>
  );
};

export default PaymentsPage;
