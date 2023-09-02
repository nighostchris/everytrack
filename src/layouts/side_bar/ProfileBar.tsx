import React from 'react';

const ProfileBar: React.FC = () => {
  return (
    <div className="flex flex-shrink-0 bg-gray-700 p-4">
      <a href="#" className="group block flex-shrink-0">
        <div className="flex items-center">
          <div>
            <img className="inline-block h-10 w-10 rounded-full" src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="" />
          </div>
          <div className="ml-3">
            <p className="text-base font-medium text-white">Tom Cook</p>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProfileBar;
