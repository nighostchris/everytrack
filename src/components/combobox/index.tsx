/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
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

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

interface ComboboxProps {
  label: string;
  values: string[];
  setValues: (newValues: string[]) => void;
  options: { value: string; display: string }[];
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({ label, values, setValues, options, className }) => {
  const [open, setOpen] = React.useState(false);
  console.log({ values });

  return (
    <div className={clsx('w-full', className)}>
      {label && <label className="mb-2 block text-sm font-medium leading-none text-gray-700">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outlined"
            className="w-full justify-between !border-gray-300 !px-3 !font-normal !text-slate-900 hover:!bg-transparent focus:outline-none active:!scale-100"
          >
            To be constructed
            <RxCaretSort className="h-5 w-5 text-black opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent asChild className="!p-0" style={{ width: 'var(--radix-popper-anchor-width)' }}>
          <Command>
            <CommandInput />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map(({ value, display }) => (
                <CommandItem
                  // key={framework.value}
                  // value={framework.value}
                  onSelect={() => {
                    if (values.includes(value)) {
                      setValues(values.filter((v) => v !== value));
                    } else {
                      setValues([...values, value]);
                    }
                    setOpen(false);
                  }}
                >
                  <FaCheck className={clsx('mr-2 h-4 w-4', values.includes(value) ? 'opacity-100' : 'opacity-0')} />
                  {display}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
