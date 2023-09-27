import clsx from 'clsx';
import {
  FaGift,
  FaChild,
  FaSchool,
  FaQuestion,
  FaTrainTram,
  FaBagShopping,
  FaPlaneArrival,
  FaHouseChimney,
  FaMoneyBillWave,
} from 'react-icons/fa6';
import React from 'react';
import { HiOutlineReceiptTax } from 'react-icons/hi';
import { GiBowlingStrike, GiMedicines } from 'react-icons/gi';
import { MdDining, MdLocalGroceryStore } from 'react-icons/md';

import { Badge } from '@components';
import { ExpenseCategory } from '@api/everytrack_backend';

interface ExpenseCategoryBadgeProps {
  category: ExpenseCategory;
}

function getIconByCategory(category: ExpenseCategory) {
  switch (category) {
    case 'accomodation':
      return FaHouseChimney;
    case 'bills':
      return FaMoneyBillWave;
    case 'dining':
      return MdDining;
    case 'education':
      return FaSchool;
    case 'entertainment':
      return GiBowlingStrike;
    case 'gift':
      return FaGift;
    case 'groceries':
      return MdLocalGroceryStore;
    case 'health':
      return GiMedicines;
    case 'kids':
      return FaChild;
    case 'shopping':
      return FaBagShopping;
    case 'transportation':
      return FaTrainTram;
    case 'travel':
      return FaPlaneArrival;
    case 'tax':
      return HiOutlineReceiptTax;
    default:
      return FaQuestion;
  }
}

export const ExpenseCategoryBadge: React.FC<ExpenseCategoryBadgeProps> = ({ category }) => {
  return (
    <Badge
      icon={getIconByCategory(category)}
      className={clsx('flex-start flex w-fit flex-row items-center space-x-2 rounded-md px-4 py-1', {
        'bg-green-100 text-green-700': category === 'accomodation',
        'bg-red-100 text-red-700': category === 'entertainment',
        'bg-blue-100 text-blue-700': category === 'education',
        'bg-purple-100 text-purple-700': category === 'shopping',
        'bg-rose-100 text-rose-700': category === 'groceries',
        'bg-fuchsia-100 text-fuchsia-700': category === 'dining',
        'bg-sky-100 text-sky-700': category === 'travel',
        'bg-indigo-100 text-indigo-700': category === 'transportation',
        'bg-cyan-100 text-cyan-700': category === 'bills',
        'bg-orange-100 text-orange-700': category === 'tax',
        'bg-slate-100 text-slate-700': category === 'others',
        'bg-neutral-100 text-neutral-700': ['health', 'gift', 'kids'].includes(category),
      })}
    >
      <span className="max-w-[500px] font-medium capitalize">{category}</span>
    </Badge>
  );
};

export default ExpenseCategoryBadge;
