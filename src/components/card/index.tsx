import clsx from 'clsx';
import React from 'react';

import { StatCard } from './stat_card';
import { CardTitle } from './CardTitle';
import { CardHeader } from './CardHeader';
import { CardFooter } from './CardFooter';
import { CardContent } from './CardContent';
import { CardDescription } from './CardDescription';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('rounded-lg border border-gray-300 bg-gray-50 text-gray-800', className)} {...props} />
));

Card.displayName = 'Card';

export { CardTitle, CardHeader, CardFooter, CardContent, CardDescription, StatCard };

export default Card;
