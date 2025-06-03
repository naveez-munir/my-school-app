import { useState, useEffect } from "react";
import GenericCombobox from "~/components/common/form/inputs/Select";
import { 
  generateAcademicYears, 
  getCurrentAcademicYear, 
  type AcademicYearOption 
} from "~/utils/academicYearUtils";

interface AcademicYearSelectorProps {
  value?: string;
  onChange: (year: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AcademicYearSelector({
  value = "",
  onChange,
  label = "Academic Year",
  required = false,
  placeholder = "Select academic year",
  disabled = false,
  className = "",
}: AcademicYearSelectorProps) {
  const academicYears = generateAcademicYears();
  const [selectedYear, setSelectedYear] = useState<AcademicYearOption | null>(null);

  useEffect(() => {
    if (!value) {
      const defaultAcademicYear = getCurrentAcademicYear();
      const defaultOption = academicYears.find((y) => y.value === defaultAcademicYear) || null;
      
      setSelectedYear(defaultOption);
      if (defaultOption) {
        onChange(defaultOption.value);
      }
    }
  }, []);

  useEffect(() => {
    if (value) {
      const matchingYear = academicYears.find((y) => y.value === value);
      setSelectedYear(matchingYear || null);
    } else {
      setSelectedYear(null);
    }
  }, [value]);

  const handleYearChange = (selected: AcademicYearOption | null) => {
    setSelectedYear(selected);
    if (selected) {
      onChange(selected.value);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
        // disabled={disabled}
      />
    </div>
  );
}
