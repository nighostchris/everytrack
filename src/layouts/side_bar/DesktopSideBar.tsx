import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import ProfileBar from './ProfileBar';
import { SIDE_BAR_TABS } from './consts';

const DesktopSideBar: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="z-10 hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
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
            {SIDE_BAR_TABS.map(({ name, icon: Icon, link }) => (
              <Link
                to={link}
                key={`desktop-side-nav-${name}`}
                className={clsx(
                  {
                    'bg-gray-900 text-white': pathname.includes(link),
                    'text-gray-300 hover:bg-gray-700 hover:text-white': !pathname.includes(link),
                  },
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                )}
              >
                <Icon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <ProfileBar />
      </div>
    </div>
  );
};

export default DesktopSideBar;
