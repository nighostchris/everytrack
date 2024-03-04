/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { IconBase } from 'react-icons';
import { GiLockedChest, GiReceiveMoney } from 'react-icons/gi';

import { useDisplayCurrency } from '@hooks';
import { Card, CardTitle } from '@components';
import AssetDistributionChart from '../asset_distribution_chart';
import type { AssetDistributionData } from '../../hooks/use_dashboard_state';

interface TotalBalanceOverviewCardProps {
  lockedFund: string;
  totalBalance: string;
  instantAccessibleBalance: string;
  assetDistribution: AssetDistributionData[];
  className?: string;
}

interface AssetInformationCardProps {
  value: string;
  title: string;
  currency: string;
  textColor: string;
  icon: typeof IconBase;
  backgroundColor: string;
  className?: string;
}

const AssetInformationCard: React.FC<AssetInformationCardProps> = ({
  icon: Icon,
  title,
  value,
  currency,
  textColor,
  backgroundColor,
  className,
}) => {
  return (
    <Card className={clsx('flex h-32 flex-row items-center justify-center space-x-4 border-none bg-white p-4', className)}>
      <span className={clsx('flex h-11 flex-row items-center justify-center rounded-full p-3', backgroundColor)}>
        <Icon className={clsx('h-5 w-5', textColor)} />
      </span>
      <div className="flex flex-col items-center space-y-1">
        <CardTitle className="w-min text-center text-sm !font-normal leading-tight">{title}</CardTitle>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-medium">{`${currency} ${value}`}</p>
      </div>
    </Card>
  );
};

export const TotalBalanceOverviewCard: React.FC<TotalBalanceOverviewCardProps> = ({
  lockedFund,
  totalBalance,
  assetDistribution,
  instantAccessibleBalance,
  className,
}) => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Card className={clsx('flex flex-col !bg-white p-6 lg:h-136', className)}>
      <h4 className="text-sm font-medium text-gray-500">Overview</h4>
      <h5 className="my-1 text-lg font-semibold">Total Balance</h5>
      <div className="flex h-full w-full flex-col">
        <p className="mb-3 overflow-hidden text-ellipsis whitespace-nowrap text-5xl font-semibold">{`${symbol} ${totalBalance}`}</p>
        <div className="relative mb-6 flex h-[220px] w-full flex-col items-center justify-center">
          <AssetDistributionChart data={assetDistribution} />
        </div>
        <div className="grid grid-rows-1 gap-y-4 border-t border-gray-200 lg:grid-cols-3 lg:gap-x-4">
          {[
            {
              title: 'Accessible Fund',
              value: instantAccessibleBalance,
              textColor: 'text-yellow-800',
              backgroundColor: 'bg-yellow-200',
              icon: GiReceiveMoney,
            },
            {
              title: 'Locked Fund',
              value: lockedFund,
              textColor: 'text-red-800',
              backgroundColor: 'bg-red-200',
              icon: GiLockedChest,
            },
          ].map((props) => (
            <AssetInformationCard {...props} currency={symbol} />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TotalBalanceOverviewCard;
