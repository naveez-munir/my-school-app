import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import type { BaseInputProps } from "~/types/commonTypes";

export const PasswordInput = ({
  label,
  value,
  onChange,
  name,
  error,
  required = false,
  placeholder = 'Enter password',
  disabled = false
}: Omit<BaseInputProps, 'type'>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && '*'}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          name={name}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`mt-1 block w-full rounded-md shadow-sm p-2 pr-10 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? 
            <EyeOffIcon className="h-5 w-5" /> : 
            <EyeIcon className="h-5 w-5" />
          }
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
