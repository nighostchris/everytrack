import React from 'react';
import dayjs from 'dayjs';
import { type ToolbarProps } from 'react-big-calendar';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

import { Button } from '@components';

interface PaymentsCalendarToolbarProps extends ToolbarProps {}

export const PaymentsCalendarToolbar: React.FC<PaymentsCalendarToolbarProps> = ({ date, onNavigate }) => {
  return (
    <div className="flex flex-row items-center justify-between border-b border-b-gray-200 px-6 py-4">
      <h2 className="text-md font-medium">{dayjs(date).format('MMMM YYYY')}</h2>
      <div className="flex flex-row items-center space-x-6">
        <Button type="button" variant="outlined" className="font-normal" onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <FaArrowLeft className="h-4 w-4 hover:cursor-pointer" onClick={() => onNavigate('PREV')} />
        <FaArrowRight className="h-4 w-4 hover:cursor-pointer" onClick={() => onNavigate('NEXT')} />
      </div>
    </div>
  );
};

export default PaymentsCalendarToolbar;
