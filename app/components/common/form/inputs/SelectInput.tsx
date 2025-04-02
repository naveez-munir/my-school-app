import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronsUpDown } from 'lucide-react';

// Type definition for the component props
interface SelectInputProps<T extends Record<string, string>> {
  label: string;
  value: T[keyof T] | null | undefined;
  options: T;
  onChange: (value: T[keyof T]) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function SelectInput<T extends Record<string, string>>({
  label,
  value,
  options,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}: SelectInputProps<T>) {
  // Determine the current value, coalescing undefined to null
  const currentValue = value ?? null;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && '*'}
      </label>
      <Listbox 
        value={currentValue} 
        onChange={onChange}
        disabled={disabled}
      >
        <div className="relative mt-1">
          <ListboxButton 
            className={`relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <span className={`block truncate ${!currentValue ? 'text-gray-400' : ''}`}>
              {currentValue?.toLocaleUpperCase() || placeholder || 'Select an option'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-4 w-4 text-gray-400" />
            </span>
          </ListboxButton>
          <ListboxOptions 
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {Object.values(options).map((option) => (
              <ListboxOption
                key={option}
                value={option}
                className={({ focus }: { focus: boolean }) => `relative cursor-default select-none py-2 pl-3 pr-9 ${
                  focus ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                }`}
              >
                {({ selected }: { selected: boolean }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-semibold' : 'font-normal'
                      }`}
                    >
                      {option.toLocaleUpperCase()}
                    </span>
                    {selected ? (
                      <span
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600"
                      >
                        ✓
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
