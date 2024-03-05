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

// TO REDESIGN: come up with better color scheme
export const TRANSACTION_CATEGORY_CHART_COLORS: { [category: string]: string } = {
  income: '#c2410c',
  gift: '#364639',
  transportation: '#974537',
  bills: '#0e7490',
  housing: '#334155',
  food: '#c90721',
  travel: '#0369a1',
  shopping: '#fae8ff',
  children: '#7e22ce',
  education: '#1d4ed8',
  health: '#be123c',
  others: '#15803d',
  transfers: '#b91c1c',
};

export const ADVANCED_SEARCH_SORTING_OPTIONS = ['date-latest-first', 'date-oldest-first'] as const;

export const TRANSACTION_CATEGORIES = [
  'paychecks',
  'interest',
  'business-income',
  'other-income',
  'charity',
  'gifts',
  'gas',
  'car-maintenance',
  'parking',
  'public-transit',
  'mortgage',
  'rent',
  'home-improvement',
  'water',
  'electricity',
  'broadband',
  'phone',
  'tax',
  'insurance',
  'credit-card-payment',
  'groceries',
  'restaurants',
  'bars',
  'travel',
  'entertainment',
  'shopping',
  'clothings',
  'furnitures',
  'electronics',
  'child-care',
  'child-activities',
  'tuition-fee',
  'student-loans',
  'fitness',
  'medical',
  'dental',
  'uncategorized',
  'bank-transfer',
] as const;

export const TRANSACTION_GROUP_KEYS = [
  'income',
  'gift',
  'transportation',
  'housing',
  'bills',
  'food',
  'entertainment',
  'shopping',
  'children',
  'education',
  'health',
  'others',
  'transfers',
] as const;

export const TRANSACTION_GROUPS: {
  key: (typeof TRANSACTION_GROUP_KEYS)[number];
  display: string;
  categories: (typeof TRANSACTION_CATEGORIES)[number][];
}[] = [
  {
    key: 'income',
    display: 'Income',
    categories: ['paychecks', 'interest', 'business-income', 'other-income'],
  },
  {
    key: 'transportation',
    display: 'Transport',
    categories: ['gas', 'car-maintenance', 'parking', 'public-transit'],
  },
  {
    key: 'bills',
    display: 'Bills',
    categories: ['water', 'electricity', 'broadband', 'phone', 'tax', 'insurance', 'credit-card-payment'],
  },
  {
    key: 'food',
    display: 'Food & Dining',
    categories: ['groceries', 'restaurants', 'bars'],
  },
  {
    key: 'entertainment',
    display: 'Entertainment',
    categories: ['travel', 'entertainment'],
  },
  {
    key: 'shopping',
    display: 'Shopping',
    categories: ['shopping', 'clothings', 'furnitures', 'electronics'],
  },
  {
    key: 'children',
    display: 'Children',
    categories: ['child-care', 'child-activities'],
  },
  {
    key: 'education',
    display: 'Education',
    categories: ['tuition-fee', 'student-loans'],
  },
  {
    key: 'health',
    display: 'Health',
    categories: ['fitness', 'medical', 'dental'],
  },
  {
    key: 'housing',
    display: 'Housing',
    categories: ['mortgage', 'rent', 'home-improvement'],
  },
  {
    key: 'transfers',
    display: 'Transfers',
    categories: ['bank-transfer'],
  },
  {
    key: 'gift',
    display: 'Gifts & Donations',
    categories: ['charity', 'gifts'],
  },
  {
    key: 'others',
    display: 'Others',
    categories: ['uncategorized'],
  },
] as const;

export const TRANSACTION_GROUP_COLORS: Record<(typeof TRANSACTION_GROUP_KEYS)[number], string> = {
  food: 'text-rose-700',
  bills: 'text-cyan-700',
  income: 'text-green-700',
  others: 'text-slate-700',
  health: 'text-monarch-700',
  education: 'text-blue-700',
  gift: 'text-finlandia-700',
  children: 'text-crail-700',
  shopping: 'text-purple-700',
  housing: 'text-fuchsia-700',
  transfers: 'text-orange-700',
  entertainment: 'text-sky-700',
  transportation: 'text-indigo-700',
};

export const TRANSACTION_GROUP_BACKGROUND_COLORS: Record<(typeof TRANSACTION_GROUP_KEYS)[number], string> = {
  food: 'bg-rose-100',
  bills: 'bg-cyan-100',
  income: 'bg-green-100',
  others: 'bg-slate-100',
  health: 'bg-monarch-100',
  education: 'bg-blue-100',
  gift: 'bg-finlandia-100',
  children: 'bg-crail-100',
  shopping: 'bg-purple-100',
  housing: 'bg-fuchsia-100',
  transfers: 'bg-orange-100',
  entertainment: 'bg-sky-100',
  transportation: 'bg-indigo-100',
};
