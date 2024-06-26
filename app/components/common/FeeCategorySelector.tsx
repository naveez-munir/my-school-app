import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useFeeCategories } from '~/hooks/useFeeCategoryQueries';
import type { FeeCategory, FeeFrequency } from '~/types/studentFee';

interface FeeCategorySelectorProps {
  value?: string;
  onChange: (categoryId: string, category?: FeeCategory) => void;
  frequency?: FeeFrequency;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onlyActive?: boolean;
}

export function FeeCategorySelector({
  value = '',
  onChange,
  frequency,
  label = 'Fee Category',
  required = false,
  placeholder = 'Select or enter fee category',
  disabled = false,
  className = '',
  onlyActive = true
}: FeeCategorySelectorProps) {
  const { data: allCategories = [], isLoading: loading } = useFeeCategories({ 
    isActive: onlyActive ? true : undefined,
    frequency
  });
  
  const [selectedCategory, setSelectedCategory] = useState<FeeCategory | null>(null);

  useEffect(() => {
    handleSelection();
  }, [value, allCategories]);

  const handleSelection = () => {
    if (value && allCategories.length > 0) {
      const matchingCategory = allCategories.find(c => c._id === value);
      setSelectedCategory(matchingCategory || null);
    } else {
      setSelectedCategory(null);
    }
  }

  useEffect(() => {
    setSelectedCategory(null);
  }, [frequency]);

  useEffect(()=>{
    handleSelection();
  },[])

  const handleCategoryChange = (selected: FeeCategory | null) => {
    setSelectedCategory(selected);
    onChange(selected ? selected._id : '', selected || undefined);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      {loading ? (
        <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 h-8 sm:h-10 lg:h-12 animate-pulse"></div>
      ) : (
        <GenericCombobox<FeeCategory>
          items={allCategories}
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayKey="name"
          valueKey="_id"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
