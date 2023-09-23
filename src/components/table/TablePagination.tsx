import { Table } from '@tanstack/react-table';
import { RxChevronLeft, RxChevronRight, RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx';

import { IconButton } from '../button';

interface TablePaginationProps<Data> {
  table: Table<Data>;
}

export function TablePagination<Data>({ table }: TablePaginationProps<Data>) {
  return (
    <div className="flex flex-row items-center justify-end px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <IconButton
            icon={RxDoubleArrowLeft}
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          />
          <IconButton
            icon={RxChevronLeft}
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
          <IconButton icon={RxChevronRight} className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
          <IconButton
            icon={RxDoubleArrowRight}
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          />
        </div>
      </div>
    </div>
  );
}
