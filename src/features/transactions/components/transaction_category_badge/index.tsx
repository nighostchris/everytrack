import clsx from 'clsx';
import React from 'react';
import { FaQuestion } from 'react-icons/fa6';

import { Badge } from '@components';
import { getTransactionGroupByCategory } from '@utils';
import { TransactionCategory } from '@api/everytrack_backend';
import { TRANSACTION_GROUP_COLORS, TRANSACTION_GROUP_BACKGROUND_COLORS } from '@consts';

interface TransactionCategoryBadgeProps {
  category: TransactionCategory;
}

export const TransactionCategoryBadge: React.FC<TransactionCategoryBadgeProps> = ({ category }) => {
  return (
    <Badge
      // TO FIX
      icon={FaQuestion}
      className={clsx(
        'flex-start flex w-fit flex-row items-center space-x-2 rounded-md px-4 py-1',
        TRANSACTION_GROUP_COLORS[getTransactionGroupByCategory(category)] ?? 'text-slate-700',
        TRANSACTION_GROUP_BACKGROUND_COLORS[getTransactionGroupByCategory(category)] ?? 'bg-slate-100',
      )}
    >
      <span className="max-w-[500px] font-medium capitalize">{category}</span>
    </Badge>
  );
};

export default TransactionCategoryBadge;
