import clsx from 'clsx';
import React from 'react';
import { IconBase } from 'react-icons';

import { Card, CardHeader, CardTitle, CardContent } from '../index';

interface StatCardProps {
  title: string;
  icon: typeof IconBase;
  className?: string;
  children?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, icon: Icon, className, children }) => {
  return (
    <Card className={clsx(className)}>
      <CardHeader className="!flex-row items-center justify-between !space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">{title}</CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default StatCard;
