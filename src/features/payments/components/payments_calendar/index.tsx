import clsx from 'clsx';
import React from 'react';
import dayjs from 'dayjs';
import { Calendar, Event, dayjsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { useFuturePayments } from '@hooks';
import PaymentsCalendarToolbar from '../payments_calendar_toolbar';

const localizer = dayjsLocalizer(dayjs);
const DragAndDropCalendar = withDragAndDrop(Calendar);

interface PaymentsCalendarProps {
  className?: string;
}

export const PaymentsCalendar: React.FC<PaymentsCalendarProps> = ({ className }) => {
  const { futurePayments } = useFuturePayments();

  const [targetMonth, setTargetMonth] = React.useState(dayjs().month() + 1);

  const events: Event[] = React.useMemo(() => {
    if (!futurePayments) {
      return [];
    }
    return futurePayments
      .filter(({ scheduledAt }) => dayjs.unix(scheduledAt).month() + 1 === targetMonth)
      .map(({ name, scheduledAt }) => ({
        title: (
          <div className="rounded-sm bg-blue-500 px-2 py-1 text-xs">
            <p className="overflow-hidden text-ellipsis text-white">{name}</p>
          </div>
        ),
        start: dayjs.unix(scheduledAt).toDate(),
        end: dayjs.unix(scheduledAt).toDate(),
        allDay: true,
      }));
  }, [targetMonth, futurePayments]);

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
        }}
        events={events}
      />
    </div>
  );
};

export default PaymentsCalendar;
