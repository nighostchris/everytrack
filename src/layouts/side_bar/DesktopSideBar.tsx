/* eslint-disable max-len */
import React from 'react';
import { BsPiggyBank } from 'react-icons/bs';
import { RxDashboard } from 'react-icons/rx';
import { RiStockLine } from 'react-icons/ri';
import { FaCreditCard } from 'react-icons/fa';
import { MdSubscriptions } from 'react-icons/md';

const DesktopSideBar: React.FC = () => {
  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
              alt="Workflow"
            />
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            <a href="#" className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-sm font-medium text-white">
              <RxDashboard className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Dashboard
            </a>
            <a
              href="#"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <BsPiggyBank className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Savings
            </a>
            <a
              href="#"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <FaCreditCard className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Credit
            </a>
            <a
              href="#"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <RiStockLine className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Brokers
            </a>
            <a
              href="#"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <MdSubscriptions className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Subscriptions
            </a>
          </nav>
        </div>
        <div className="flex flex-shrink-0 bg-gray-700 p-4">
          <a href="#" className="group block w-full flex-shrink-0">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Tom Cook</p>
                <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">View profile</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DesktopSideBar;
