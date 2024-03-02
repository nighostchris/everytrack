import { RxDashboard } from 'react-icons/rx';
import { RiStockLine } from 'react-icons/ri';
import { BsGraphUp, BsPiggyBank } from 'react-icons/bs';
import { FaRepeat, FaMoneyBillTransfer } from 'react-icons/fa6';
// import { FaCreditCard } from 'react-icons/fa';

export const SIDE_BAR_TABS = [
  { name: 'Dashboard', icon: RxDashboard, link: '/dashboard' },
  { name: 'Savings', icon: BsPiggyBank, link: '/savings' },
  { name: 'Brokers', icon: RiStockLine, link: '/brokers' },
  { name: 'Transactions', icon: FaMoneyBillTransfer, link: '/transactions' },
  // { name: 'Credit', icon: FaCreditCard, link: '/credit' },
  { name: 'Payments', icon: FaRepeat, link: '/payments' },
  { name: 'Metrics', icon: BsGraphUp, link: '/metrics' },
];
