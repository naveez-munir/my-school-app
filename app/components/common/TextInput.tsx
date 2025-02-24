import type { BaseInputProps } from "~/types/commonTypes";

export const TextInput = ({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  type = 'text'
}: BaseInputProps) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && '*'}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
