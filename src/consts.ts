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
import { HiOutlineReceiptTax } from 'react-icons/hi';
import { GiBowlingStrike, GiMedicines } from 'react-icons/gi';
import { MdDining, MdLocalGroceryStore } from 'react-icons/md';

export const TRANSACTION_CATEGORIES = [
  'tax',
  'gift',
  'kids',
  'bills',
  'others',
  'health',
  'travel',
  'dining',
  'shopping',
  'education',
  'groceries',
  'accomodation',
  'entertainment',
  'transportation',
] as const;

export const TRANSACTION_CATEGORY_ICON_COLORS = {
  tax: 'text-orange-700',
  gift: 'text-finlandia-700',
  kids: 'text-crail-700',
  bills: 'text-cyan-700',
  others: 'text-slate-700',
  health: 'text-monarch-700',
  travel: 'text-sky-700',
  dining: 'text-fuchsia-700',
  shopping: 'text-purple-700',
  education: 'text-blue-700',
  groceries: 'text-rose-700',
  accomodation: 'text-green-700',
  entertainment: 'text-red-700',
  transportation: 'text-indigo-700',
} as const;

export const TRANSACTION_CATEGORY_ICON_BACKGROUND_COLORS = {
  tax: 'bg-orange-100',
  gift: 'bg-finlandia-100',
  kids: 'bg-crail-100',
  bills: 'bg-cyan-100',
  others: 'bg-slate-100',
  health: 'bg-monarch-100',
  travel: 'bg-sky-100',
  dining: 'bg-fuchsia-100',
  shopping: 'bg-purple-100',
  education: 'bg-blue-100',
  groceries: 'bg-rose-100',
  accomodation: 'bg-green-100',
  entertainment: 'bg-red-100',
  transportation: 'bg-indigo-100',
} as const;

export const TRANSACTION_CATEGORY_ICONS = {
  tax: HiOutlineReceiptTax,
  gift: FaGift,
  kids: FaChild,
  bills: FaMoneyBillWave,
  others: FaQuestion,
  health: GiMedicines,
  travel: FaPlaneArrival,
  dining: MdDining,
  shopping: FaBagShopping,
  education: FaSchool,
  groceries: MdLocalGroceryStore,
  accomodation: FaHouseChimney,
  entertainment: GiBowlingStrike,
  transportation: FaTrainTram,
} as const;
