import React from 'react';
import { BsPiggyBank } from 'react-icons/bs';
import { RxDashboard } from 'react-icons/rx';
import { RiStockLine } from 'react-icons/ri';
import { FaCreditCard } from 'react-icons/fa';
import { MdSubscriptions } from 'react-icons/md';

interface MobileSideBarProps {
  open: boolean;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({ open }) => {
  return (
    <div className={`h-0 overflow-y-auto pb-4 pt-5 ${open ? 'flex-1' : 'hidden'}`}>
      <div className="flex flex-shrink-0 items-center px-4">
        <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg" alt="Workflow" />
      </div>
      <nav className="mt-5 space-y-1 px-2">
        <a href="#" className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white">
          <RxDashboard className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
          Dashboard
        </a>
        <a
          href="#"
          className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <BsPiggyBank className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
          Savings
        </a>
        <a
          href="#"
          className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <FaCreditCard className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
          Credit
        </a>
        <a
          href="#"
          className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <RiStockLine className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
          Brokers
        </a>
        <a
          href="#"
          className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <MdSubscriptions className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
          Subscriptions
        </a>
      </nav>
    </div>
  );
};

export default MobileSideBar;
