/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { DayPicker } from 'react-day-picker';
import { RxChevronLeft, RxChevronRight } from 'react-icons/rx';

type CalendarProps = React.ComponentProps<typeof DayPicker>;

export const Calendar: React.FC<CalendarProps> = ({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={clsx('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button:
          'inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: clsx(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
        ),
        day: 'inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100',
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected: 'bg-gray-200 hover:bg-gray-200 focus:bg-gray-200',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-gray-400 opacity-50',
        day_disabled: 'text-gray-400 opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <RxChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <RxChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
};

Calendar.displayName = 'Calendar';

export default Calendar;
