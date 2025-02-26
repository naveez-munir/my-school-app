import { useState } from 'react';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { ChevronsUpDown } from 'lucide-react';

type ComboboxProps<T> = {
  items: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  displayKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
};

const GenericCombobox = <T extends Record<string, any>>({
  items,
  value,
  onChange,
  displayKey,
  valueKey,
  placeholder = "Select an item..."
}: ComboboxProps<T>) => {
  const [query, setQuery] = useState('');

  const filteredItems = query === ''
    ? items
    : items.filter((item) => {
        return String(item[displayKey])
          .toLowerCase()
          .includes(query.toLowerCase());
      });

  return (
    <div className="relative">
      <Combobox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <ComboboxInput
              className="w-full border-none py-2 pl-3 pr-10 text-gray-900 focus:outline-none"
              displayValue={(item: T | null) => 
                item ? String(item[displayKey]) : ''
              }
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredItems.length === 0 && query !== '' ? (
              <div className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900">
                Nothing found.
              </div>
            ) : (
              filteredItems.map((item) => (
                <ComboboxOption
                  key={String(item[valueKey])}
                  value={item}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      {String(item[displayKey])}
                    </span>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
};

export default GenericCombobox;
