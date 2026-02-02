import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronsUpDown, X, Check } from 'lucide-react';

type MultiSelectProps<T> = {
  items: T[];
  value: T[];
  onChange: (value: T[]) => void;
  displayKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  showTags?: boolean;
};

const MultiSelect = <T extends Record<string, any>>({
  items,
  value,
  onChange,
  displayKey,
  valueKey,
  placeholder = "Select items...",
  disabled = false,
  label,
  required = false,
  error,
  showTags = true
}: MultiSelectProps<T>) => {
  const [query, setQuery] = useState('');

  const isSelected = (item: T) => {
    return value.some(v => v[valueKey] === item[valueKey]);
  };

  const filteredItems = query === ''
    ? items
    : items.filter((item) => {
        return String(item[displayKey])
          .toLowerCase()
          .includes(query.toLowerCase());
      });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aSelected = isSelected(a);
    const bSelected = isSelected(b);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  const handleSelect = (item: T) => {
    if (isSelected(item)) {
      onChange(value.filter(v => v[valueKey] !== item[valueKey]));
    } else {
      onChange([...value, item]);
    }
  };

  const handleRemove = (item: T) => {
    onChange(value.filter(v => v[valueKey] !== item[valueKey]));
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) return String(value[0][displayKey]);
    return `${value.length} items selected`;
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      {showTags && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((item) => (
            <div
              key={String(item[valueKey])}
              className="inline-flex items-center bg-blue-50 text-blue-700 rounded-md px-2 py-1 text-xs sm:text-sm"
            >
              <span>{String(item[displayKey])}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="ml-1 hover:text-blue-900 focus:outline-none"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Listbox value={value} onChange={onChange} disabled={disabled} multiple>
          <div className="relative mt-1">
            <ListboxButton
              className={`relative w-full cursor-pointer rounded-md border bg-white py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-8 sm:pr-10 text-left shadow-sm text-xs sm:text-sm ${
                disabled
                  ? 'bg-gray-100 cursor-not-allowed border-gray-300'
                  : error
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            >
              <span className={`block truncate ${value.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                {getDisplayText()}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${disabled ? 'text-gray-300' : 'text-gray-400'}`}
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            {!disabled && (
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs sm:text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {sortedItems.length === 0 ? (
                  <div className="relative cursor-default select-none py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-8 sm:pr-9 text-gray-500">
                    No items found.
                  </div>
                ) : (
                  sortedItems.map((item, index) => {
                    const selected = isSelected(item);
                    const prevItem = index > 0 ? sortedItems[index - 1] : null;
                    const showDivider = prevItem && isSelected(prevItem) && !selected;

                    return (
                      <div key={String(item[valueKey])}>
                        {showDivider && (
                          <div className="border-t border-gray-200 my-1" />
                        )}
                        <ListboxOption
                          value={item}
                          onClick={() => handleSelect(item)}
                          className={({ focus }) =>
                            `relative cursor-pointer select-none py-2 pl-3 pr-9 transition-colors ${
                              focus
                                ? 'bg-blue-50 text-blue-900'
                                : selected
                                ? 'bg-blue-50/50 text-blue-700'
                                : 'text-gray-900 hover:bg-gray-50'
                            }`
                          }
                        >
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {String(item[displayKey])}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                <Check className="h-4 w-4" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        </ListboxOption>
                      </div>
                    );
                  })
                )}
              </ListboxOptions>
            )}
          </div>
        </Listbox>
      </div>

      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default MultiSelect;

