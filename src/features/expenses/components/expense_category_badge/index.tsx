import clsx from 'clsx';
import React from 'react';
import { FaQuestion } from 'react-icons/fa6';

import { Badge } from '@components';
import { ExpenseCategory } from '@api/everytrack_backend';
import { EXPENSE_CATEGORY_ICONS, EXPENSE_CATEGORY_ICON_COLORS, EXPENSE_CATEGORY_ICON_BACKGROUND_COLORS } from '@consts';

interface ExpenseCategoryBadgeProps {
  category: ExpenseCategory;
}

export const ExpenseCategoryBadge: React.FC<ExpenseCategoryBadgeProps> = ({ category }) => {
  return (
    <Badge
      icon={EXPENSE_CATEGORY_ICONS[category] ?? FaQuestion}
      className={clsx(
        'flex-start flex w-fit flex-row items-center space-x-2 rounded-md px-4 py-1',
        EXPENSE_CATEGORY_ICON_COLORS[category] ?? 'text-slate-700',
        EXPENSE_CATEGORY_ICON_BACKGROUND_COLORS[category] ?? 'bg-slate-100',
      )}
    >
      <span className="max-w-[500px] font-medium capitalize">{category}</span>
    </Badge>
  );
};

export default ExpenseCategoryBadge;
