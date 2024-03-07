import clsx from 'clsx';
import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useShallow } from 'zustand/react/shallow';
import { IoIosRemoveCircle } from 'react-icons/io';
import { PiRepeatFill, PiNumberCircleOneFill } from 'react-icons/pi';
import { Calendar, Event, dayjsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { store } from '@features/payments/zustand';
import PaymentsCalendarToolbar from '../payments_calendar_toolbar';
import { Popover, PopoverContent, PopoverTrigger } from '@components/index';
import { PaymentsCalendarEvent } from '@features/payments/hooks/use_payments_state';

dayjs.extend(duration);

const localizer = dayjsLocalizer(dayjs);
const DragAndDropCalendar = withDragAndDrop(Calendar);

interface PaymentsCalendarProps {
  events: PaymentsCalendarEvent[];
  className?: string;
}

export const PaymentsCalendar: React.FC<PaymentsCalendarProps> = ({ events, className }) => {
  const { updateOpenDeleteFuturePaymentModal, populateDeleteFuturePaymentModalState } = store(
    useShallow(({ updateOpenDeleteFuturePaymentModal, populateDeleteFuturePaymentModalState }) => ({
      updateOpenDeleteFuturePaymentModal,
      populateDeleteFuturePaymentModalState,
    })),
  );

  const [targetMonth, setTargetMonth] = React.useState(dayjs().month() + 1);

  const targetMonthEvents: Event[] = React.useMemo(
    () => events.filter(({ start }) => dayjs(start).month() + 1 === targetMonth),
    [events, targetMonth],
  );

  console.log({ events, targetMonth });

  return (
    <div className={clsx('min-h-[632px] w-full rounded-lg bg-white pb-8', className)}>
      <DragAndDropCalendar
        views={['month']}
        defaultView="month"
        localizer={localizer}
        formats={{
          dateFormat: 'D',
        }}
        onNavigate={(date) => setTargetMonth(dayjs(date).month() + 1)}
        components={{
          toolbar: (props) => <PaymentsCalendarToolbar {...props} />,
          dateCellWrapper: ({ value }) => {
            const isCurrentDay = dayjs(value).isSame(dayjs().startOf('day'));
            return (
              <div className="rbc-day-bg p-1">
                {dayjs(value).month() + 1 === targetMonth && (
                  <span
                    className={clsx('flex h-6 w-6 flex-row items-center justify-center', {
                      'rounded-full bg-[#EB7E77] font-medium !text-white': dayjs(value).isSame(dayjs().startOf('day')),
                    })}
                  >
                    <p
                      className={clsx('text-xs', {
                        'text-white': isCurrentDay,
                        'text-gray-800': !isCurrentDay,
                      })}
                    >
                      {dayjs(value).date()}
                    </p>
                  </span>
                )}
              </div>
            );
          },
          event: (props) => {
            const { id, title, income, symbol, amount, rolling, frequency } = props.event as {
              id: string;
              title: string;
              income: boolean;
              symbol: string;
              amount: string;
              rolling: boolean;
              frequency: number;
            };
            return (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex w-full flex-row space-x-1 rounded-sm bg-blue-500 px-2 py-1 text-xs">
                    {rolling ? (
                      <PiRepeatFill className="min-h-4 min-w-4 text-white" />
                    ) : (
                      <PiNumberCircleOneFill className="min-h-4 min-w-4 text-white" />
                    )}
                    <p className="overflow-hidden text-ellipsis text-left text-white">{title}</p>
                  </button>
                </PopoverTrigger>
                <PopoverContent asChild align="start" collisionPadding={{ left: 32, right: 32 }}>
                  <div className="z-60 grid w-44 max-w-44 grid-cols-3 md:w-80 md:max-w-none">
                    <div className="col-span-2 flex flex-col space-y-1">
                      <h4 className="whitespace-pre-wrap text-xs font-medium text-gray-700 md:text-sm">{title}</h4>
                      <h5 className="text-xs text-gray-400">{rolling ? frequency : 'One off'}</h5>
                      <p
                        className={clsx('mr-3 overflow-hidden text-ellipsis whitespace-nowrap text-sm md:hidden', {
                          'text-green-700': income,
                          'text-red-700': !income,
                        })}
                      >
                        {`${income ? '+' : '-'}${symbol}${amount}`}
                      </p>
                    </div>
                    <div className="col-span-1 flex flex-row items-center justify-end">
                      <p
                        className={clsx('mr-3 hidden overflow-hidden text-ellipsis whitespace-nowrap text-sm md:block', {
                          'text-green-700': income,
                          'text-red-700': !income,
                        })}
                      >
                        {`${income ? '+' : '-'}${symbol}${amount}`}
                      </p>
                      <IoIosRemoveCircle
                        className="h-5 min-h-5 w-5 min-w-5 text-gray-600 hover:cursor-pointer"
                        onClick={() => {
                          populateDeleteFuturePaymentModalState(id);
                          updateOpenDeleteFuturePaymentModal(true);
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          },
        }}
        events={targetMonthEvents}
      />
    </div>
  );
};

export default PaymentsCalendar;
