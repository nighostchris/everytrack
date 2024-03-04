/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { LuX } from 'react-icons/lu';
import { FaCheck } from 'react-icons/fa6';
import { RxCaretSort } from 'react-icons/rx';

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

interface ComboboxGroupOption {
  value: string;
  display: string;
}

interface ComboboxGroups {
  [heading: string]: ComboboxGroupOption[];
}

interface ComboboxProps {
  label: string;
  values: string[];
  placeholder: string;
  groups: ComboboxGroups;
  setValues: (newValues: string[]) => void;
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({ label, values, setValues, groups, placeholder, className }) => {
  const [open, setOpen] = React.useState(false);

  const groupItemsMap = React.useMemo(() => {
    const map = new Map<any, string>();
    Object.values(groups).forEach((options) => options.forEach(({ value, display }) => map.set(value, display)));
    return map;
  }, [groups]);

  return (
    <div className={clsx('w-full', className)}>
      {label && <label className="mb-2 block text-sm font-medium leading-none text-gray-700">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
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
              'h-fit min-h-10 w-full justify-between !border-gray-300 !px-3 !font-normal hover:!bg-transparent focus:outline-none active:!scale-100',
              { '!text-gray-400': values.length === 0, '!text-slate-900': values.length !== 0 },
            )}
          >
            {values.length === 0 ? (
              placeholder
            ) : (
              <div className="flex flex-col space-y-2">
                {values.map((value) => (
                  <div
                    className="child-button z-20 flex w-fit flex-row items-center rounded-md bg-gray-100"
                    onClick={() => {
                      if (values.includes(value)) {
                        setValues(values.filter((v) => v !== value));
                      } else {
                        setValues([...values, value]);
                      }
                    }}
                  >
                    <p className="overflow-hidden text-ellipsis py-1 pl-3 pr-2">{groupItemsMap.get(value) || ''}</p>
                    <div className="flex flex-col rounded-r-md p-2 hover:bg-gray-300">
                      <LuX className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <RxCaretSort className="h-5 w-5 text-black opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent asChild className="!p-0" style={{ width: 'var(--radix-popper-anchor-width)' }}>
          <Command>
            <CommandInput />
            <CommandEmpty>No framework found.</CommandEmpty>
            <div className="flex max-h-64 w-full flex-col overflow-y-auto">
              {Object.entries(groups).map(([heading, options]) => (
                <CommandGroup heading={heading}>
                  {options.map(({ value, display }, optionIndex) => (
                    <CommandItem
                      onSelect={() => {
                        if (values.includes(value)) {
                          setValues(values.filter((v) => v !== value));
                        } else {
                          setValues([...values, value]);
                        }
                        setOpen(false);
                      }}
                    >
                      <div
                        className={clsx('mx-3 mb-1 flex w-full flex-row items-center rounded-sm px-3 py-2 hover:bg-gray-100', {
                          'mt-2': optionIndex === 0,
                          '!mb-2': optionIndex === options.length - 1,
                        })}
                      >
                        <FaCheck className={clsx('mr-2 h-4 w-4', values.includes(value) ? 'opacity-100' : 'opacity-0')} />
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
    </div>
  );
};
