/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { BiHide } from 'react-icons/bi';
import { FaSort } from 'react-icons/fa';
import { Column } from '@tanstack/react-table';
import { FaArrowUpAZ, FaArrowDownAZ } from 'react-icons/fa6';

import { Button } from '../button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from '../dropdown_menu';

interface TableColumnHeaderProps<Data, Value> extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  column: Column<Data, Value>;
}

export function TableColumnHeader<Data, Value>({ column, title, className }: TableColumnHeaderProps<Data, Value>) {
  if (!column.getCanSort()) {
    return <div className={clsx(className)}>{title}</div>;
  }

  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="contained"
            className="-ml-4 h-8 bg-transparent data-[state=open]:bg-gray-100 dark:bg-transparent dark:text-slate-700 dark:hover:bg-gray-200 dark:hover:text-slate-900"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <FaArrowDownAZ className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <FaArrowUpAZ className="ml-2 h-4 w-4" />
            ) : (
              <FaSort className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <FaArrowUpAZ className="mr-2 h-3.5 w-3.5 text-gray-700" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <FaArrowDownAZ className="mr-2 h-3.5 w-3.5 text-gray-700" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <BiHide className="mr-2 h-3.5 w-3.5 text-gray-700" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
