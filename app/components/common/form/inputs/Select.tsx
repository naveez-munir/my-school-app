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
  disabled?: boolean;
};

const GenericCombobox = <T extends Record<string, any>>({
  items,
  value,
  onChange,
  displayKey,
  valueKey,
  placeholder = "Select an item...",
  disabled = false
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
      <Combobox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative mt-1">
          <div className={`relative w-full cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm ${
            disabled
              ? 'bg-gray-100 cursor-not-allowed'
              : 'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
          }`}>
            <ComboboxInput
              className={`w-full border-none py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-8 sm:pr-10 text-sm focus:outline-none ${
                disabled
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'text-gray-900'
              }`}
              displayValue={(item: T | null) =>
                item ? String(item[displayKey]) : ''
              }
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              disabled={disabled}
            />
            <ComboboxButton
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              disabled={disabled}
            >
              <ChevronsUpDown
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${disabled ? 'text-gray-300' : 'text-gray-400'}`}
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          {!disabled && (
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs sm:text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredItems.length === 0 && query !== '' ? (
                <div className="relative cursor-pointer select-none py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-8 sm:pr-9 text-gray-900">
                  Nothing found.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <ComboboxOption
                    key={String(item[valueKey])}
                    value={item}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-8 sm:pr-9 ${
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
          )}
        </div>
      </Combobox>
    </div>
  );
};

export default GenericCombobox;
