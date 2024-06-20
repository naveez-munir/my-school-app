import { useState, useEffect, useMemo } from "react";
import GenericCombobox from "~/components/common/form/inputs/Select";
import { useAcademicYears } from "~/hooks/useAcademicYearQueries";

interface AcademicYearOption {
  value: string;
  label: string;
}

interface AcademicYearSelectorProps {
  value?: string;
  onChange: (year: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function AcademicYearSelector({
  value = "",
  onChange,
  label = "Academic Year",
  required = false,
  placeholder = "Select academic year",
  disabled = false,
  className = "",
  error,
}: AcademicYearSelectorProps) {
  const { data: academicYearsData = [], isLoading } = useAcademicYears();
  const [selectedYear, setSelectedYear] = useState<AcademicYearOption | null>(null);

  const academicYears = useMemo(() => {
    return academicYearsData.map(year => ({
      value: year.displayName,
      label: year.displayName
    }));
  }, [academicYearsData]);

  useEffect(() => {
    if (!value && academicYears.length > 0) {
      const activeYear = academicYearsData.find(y => y.isActive);
      const defaultOption = activeYear
        ? { value: activeYear.displayName, label: activeYear.displayName }
        : academicYears[0];

      setSelectedYear(defaultOption);
      if (defaultOption) {
        onChange(defaultOption.value);
      }
    }
  }, [academicYears, value]);

  useEffect(() => {
    if (value) {
      const matchingYear = academicYears.find((y) => y.value === value);
      setSelectedYear(matchingYear || null);
    } else {
      setSelectedYear(null);
    }
  }, [value, academicYears]);

  const handleYearChange = (selected: AcademicYearOption | null) => {
    setSelectedYear(selected);
    if (selected) {
      onChange(selected.value);
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <GenericCombobox<AcademicYearOption>
        items={academicYears}
        value={selectedYear}
        onChange={handleYearChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
      />

      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
