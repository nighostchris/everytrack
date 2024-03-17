/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { camelCase } from 'lodash';
import { FaCheck } from 'react-icons/fa6';
import { RxCaretSort } from 'react-icons/rx';
import { Control, Controller, FieldValues } from 'react-hook-form';

import {
  Button,
  Command,
  Popover,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  PopoverContent,
  PopoverTrigger,
} from '@components';
import type { ComboboxGroups } from '../classic';

interface HookedSingleComboboxProps {
  label: string;
  placeholder: string;
  groups: ComboboxGroups;
  control: Control<FieldValues, any>;
  error?: string;
  formId?: string;
  className?: string;
}

export const HookedSingleCombobox: React.FC<HookedSingleComboboxProps> = ({
  label,
  groups,
  control,
  placeholder,
  error,
  formId = camelCase(label),
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  const groupItemsMap = React.useMemo(() => {
    const map = new Map<any, string>();
    Object.values(groups).forEach((options) => options.forEach(({ value, display }) => map.set(value, display)));
    return map;
  }, [groups]);

  return (
    <div className={clsx(className, 'flex w-full max-w-sm flex-col')}>
      {label && <label className="mb-2 block text-sm font-medium leading-none text-gray-700">{label}</label>}
      <Controller
        name={formId}
        control={control}
        render={({ field: { ref, value: selectedValue, onChange, ...props } }) => (
          <Popover open={open} onOpenChange={setOpen} {...props}>
            <PopoverTrigger asChild ref={ref}>
              <Button
                variant="outlined"
                onClick={(e) => {
                  const { classList }: { classList: DOMTokenList } = e.target as any;
                  if (!classList.contains('parent-button')) {
                    e.preventDefault();
                  }
                }}
                className={clsx(
                  'parent-button',
                  'h-fit min-h-9 w-full justify-between !rounded-md !border-gray-300 !px-3 !font-normal hover:!bg-transparent focus:outline-none active:!scale-100',
                  { '!text-gray-400': !selectedValue, '!text-slate-900': selectedValue },
                )}
              >
                {groupItemsMap.get(selectedValue) ?? placeholder}
                <RxCaretSort className="h-5 w-5 text-black opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent asChild className="!p-0" style={{ width: 'var(--radix-popper-anchor-width)' }}>
              <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
                <CommandInput />
                <CommandEmpty>No category found</CommandEmpty>
                <div className="flex max-h-64 w-full flex-col overflow-y-auto">
                  {Object.entries(groups).map(([heading, options]) => (
                    <CommandGroup heading={heading}>
                      {options.map(({ value, display }) => (
                        <CommandItem
                          key={value}
                          value={display}
                          className="hover:bg-gray-100"
                          onSelect={() => {
                            onChange(value);
                            setOpen(false);
                          }}
                        >
                          <div className={clsx('mx-3 flex w-full flex-row items-center rounded-sm px-3 py-2')}>
                            <FaCheck className={clsx('mr-2 h-4 w-4', selectedValue === value ? 'opacity-100' : 'opacity-0')} />
                            {display}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </div>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

HookedSingleCombobox.displayName = 'HookedSingleCombobox';

export default HookedSingleCombobox;
