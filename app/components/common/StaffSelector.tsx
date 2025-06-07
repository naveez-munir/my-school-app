import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useStaffList } from '~/hooks/useStaffQueries';
import type { StaffListResponse } from '~/types/staff';

interface StaffSelectorProps {
  value?: string;
  onChange: (staffId: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  filter?: {
    designation?: string;
    department?: string;
    employmentStatus?: string;
  };
}

export function StaffSelector({
  value = '',
  onChange,
  label = 'Staff',
  required = false,
  placeholder = 'Select staff member',
  disabled = false,
  className = '',
  filter
}: StaffSelectorProps) {
  const { data: staffMembers = [], isLoading: loading } = useStaffList();
  const [selectedStaff, setSelectedStaff] = useState<StaffListResponse | null>(null);

  useEffect(() => {
    if (value && staffMembers.length > 0) {
      const matchingStaff = staffMembers.find(s => s.id === value);
      setSelectedStaff(matchingStaff || null);
    } else {
      setSelectedStaff(null);
    }
  }, [value, staffMembers]);

  const handleStaffChange = (selected: StaffListResponse | null) => {
    setSelectedStaff(selected);
    onChange(selected ? selected.id : '');
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {loading ? (
        <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 h-10 animate-pulse"></div>
      ) : (
        <GenericCombobox<StaffListResponse>
          items={staffMembers}
          value={selectedStaff}
          onChange={handleStaffChange}
          displayKey="name" 
          valueKey="id"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
