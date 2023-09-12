import React from 'react';

import Root from '@layouts/root';

export const DashboardPage: React.FC = () => {
  return (
    <>
      <Root>
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* <!-- Replace with your content --> */}
              <p>Under construction. Only savings page available now</p>
              {/* <!-- /End replace --> */}
            </div>
          </div>
        </main>
      </Root>
    </>
  );
};

export default DashboardPage;
