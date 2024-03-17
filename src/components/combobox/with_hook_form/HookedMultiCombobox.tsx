/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { camelCase } from 'lodash';
import { LuX } from 'react-icons/lu';
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

interface HookedMultiComboboxProps {
  label: string;
  placeholder: string;
  groups: ComboboxGroups;
  control: Control<FieldValues, any>;
  error?: string;
  formId?: string;
  className?: string;
}

export const HookedMultiCombobox: React.FC<HookedMultiComboboxProps> = ({
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
        render={({ field: { ref, value: selectedValues, onChange, ...props } }) => (
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
                  'h-fit min-h-10 w-full justify-between !border-gray-300 !px-3 !font-normal hover:!bg-transparent focus:outline-none active:!scale-100',
                  { '!text-gray-400': selectedValues.length === 0, '!text-slate-900': selectedValues.length !== 0 },
                )}
              >
                {selectedValues.length === 0 ? (
                  placeholder
                ) : (
                  <div className="flex flex-col space-y-2">
                    {(selectedValues as string[]).map((value) => (
                      <div
                        className="child-button z-20 flex w-fit flex-row items-center rounded-md bg-gray-100"
                        onClick={() => {
                          if ((selectedValues as string[]).includes(value)) {
                            onChange((selectedValues as string[]).filter((v) => v !== value));
                          } else {
                            onChange([...selectedValues, value]);
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
                            if ((selectedValues as string[]).includes(value)) {
                              onChange((selectedValues as string[]).filter((v) => v !== value));
                            } else {
                              onChange([...selectedValues, value]);
                            }
                            setOpen(false);
                          }}
                        >
                          <div className={clsx('mx-3 flex w-full flex-row items-center rounded-sm px-3 py-2')}>
                            <FaCheck className={clsx('mr-2 h-4 w-4', selectedValues.includes(value) ? 'opacity-100' : 'opacity-0')} />
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

HookedMultiCombobox.displayName = 'HookedMultiCombobox';

export default HookedMultiCombobox;
