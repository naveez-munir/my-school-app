import { useRef } from 'react';
import { Calendar } from 'lucide-react';
import type { BaseInputProps } from "~/types/commonTypes";

export const DateInput = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false
}: BaseInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.showPicker?.();
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && '*'}
      </label>
      <div className="relative" onClick={handleClick}>
        <input
          ref={inputRef}
          type="date"
          value={formatDateForInput(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`mt-1 block w-full rounded-md border shadow-sm pl-10 pr-3 py-2 cursor-pointer ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
