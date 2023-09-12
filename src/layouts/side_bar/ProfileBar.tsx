import React from 'react';
import { Link } from 'react-router-dom';

import { store } from '@lib/zustand';

const ProfileBar: React.FC = () => {
  const { username } = store();

  return (
    <div className="flex flex-shrink-0 bg-gray-700 p-4">
      <Link to="/settings" className="group block flex-shrink-0 hover:cursor-pointer">
        <div className="flex items-center">
          <div>
            <img className="inline-block h-10 w-10 rounded-full" src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="" />
          </div>
          <div className="ml-3">
            <p className="text-base font-medium text-white">{username}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProfileBar;
