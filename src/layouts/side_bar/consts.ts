import { BsPiggyBank } from 'react-icons/bs';
import { RxDashboard } from 'react-icons/rx';
import { RiStockLine } from 'react-icons/ri';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
// import { FaCreditCard } from 'react-icons/fa';
// import { MdSubscriptions } from 'react-icons/md';

export const SIDE_BAR_TABS = [
  { name: 'Dashboard', icon: RxDashboard, link: '/dashboard' },
  { name: 'Savings', icon: BsPiggyBank, link: '/savings' },
  { name: 'Brokers', icon: RiStockLine, link: '/brokers' },
  { name: 'Expenses', icon: FaMoneyBillTransfer, link: '/expenses' },
  // { name: 'Credit', icon: FaCreditCard, link: '/credit' },
  // { name: 'Subscriptions', icon: MdSubscriptions, link: '/subscriptions' },
];
