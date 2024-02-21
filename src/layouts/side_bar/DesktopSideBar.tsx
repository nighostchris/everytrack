import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { SIDE_BAR_TABS } from './consts';

const DesktopSideBar: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-20 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-between bg-gray-800 py-6">
        <Link to="/">
          <img className="px-4" src="/favicon.svg" alt="Everytrack" />
        </Link>
        <nav className="space-y-1.5">
          {SIDE_BAR_TABS.map(({ name, icon: Icon, link }) => (
            <Link
              to={link}
              key={`desktop-side-nav-${name}`}
              className={clsx(
                {
                  'bg-gray-900 text-white': pathname.includes(link),
                  'text-gray-300 hover:bg-gray-700 hover:text-white': !pathname.includes(link),
                },
                'group flex items-center rounded-full p-3',
              )}
            >
              <Icon className="h-6 w-6 text-gray-400 group-hover:text-gray-300" />
            </Link>
          ))}
        </nav>
        <Link
          to="/settings"
          className={clsx(
            {
              'bg-gray-900': pathname.includes('/settings'),
              'hover:bg-gray-700': !pathname.includes('/settings'),
            },
            'rounded-full p-3',
          )}
        >
          <img className="h-6 w-6" src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Settings" />
        </Link>
      </div>
    </div>
  );
};

export default DesktopSideBar;
