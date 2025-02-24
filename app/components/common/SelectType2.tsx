import type { SelectProps } from "~/types/commonTypes";

export const CustomSelect = <T extends string | number>({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  labelFn = (option: T) => String(option)
}: SelectProps<T>) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {labelFn(option)}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
