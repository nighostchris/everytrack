/* eslint-disable max-len */
import { Row } from '@tanstack/react-table';
import { RxDotsHorizontal } from 'react-icons/rx';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../dropdown_menu';

interface TableRowActionsProps<Data> {
  row: Row<Data>;
}

export function TableRowActions<Data>({ row }: TableRowActionsProps<Data>) {
  // console.log(row);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-8 w-8 cursor-pointer flex-row items-center justify-center rounded-md hover:bg-gray-200 data-[state=open]:bg-gray-100">
          <RxDotsHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
