/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import clsx from 'clsx';
import React from 'react';
import dayjs from 'dayjs';
import { RxCalendar } from 'react-icons/rx';

import Calendar from '../calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

interface DatePickerProps {
  date: Date;
  setDate: (newDate?: Date) => void;
  label?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, setDate, label, className }) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium leading-none text-gray-700">{label}</label>}
      <div className={clsx('grid gap-2 [&>button]:w-[260px]', className)}>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={clsx(
                'inline-flex h-9 w-[240px] items-center justify-start rounded-md border border-gray-300 bg-transparent px-4 py-2 text-left text-sm font-normal shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 disabled:pointer-events-none disabled:opacity-50',
                !date && 'text-gray-400',
              )}
            >
              <RxCalendar className="mr-2 h-4 w-4" />
              {dayjs(date).format('MMM DD, YYYY')}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePicker;
