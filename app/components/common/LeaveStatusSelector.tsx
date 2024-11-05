import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { LeaveStatus } from '~/types/staffLeave';

type StatusValue = LeaveStatus | 'all';

interface StatusOption {
  value: StatusValue;
  label: string;
}

interface LeaveStatusSelectorProps {
  value?: StatusValue;
  onChange: (status: StatusValue) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  includeAll?: boolean;
}

export function LeaveStatusSelector({
  value,
  onChange,
  label = 'Leave Status',
  required = false,
  placeholder = 'Select status',
  disabled = false,
  className = '',
  includeAll = false
}: LeaveStatusSelectorProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);

  const statusOptions: Record<StatusValue, string> = {
    'all': 'All Statuses',
    [LeaveStatus.PENDING]: 'Pending',
    [LeaveStatus.APPROVED]: 'Approved',
    [LeaveStatus.REJECTED]: 'Rejected',
    [LeaveStatus.CANCELLED]: 'Cancelled'
  };

  const options = useMemo(() => {
    return Object.entries(statusOptions)
      .filter(([key]) => includeAll || key !== 'all')
      .map(([value, label]) => ({
        value: value as StatusValue,
        label
      }));
  }, [includeAll]);

  useEffect(() => {
    if (value) {
      const matchingStatus = options.find(s => s.value === value);
      setSelectedStatus(matchingStatus || null);
    } else {
      setSelectedStatus(null);
    }
  }, [value, options]);

  const handleStatusChange = (selected: StatusOption | null) => {
    setSelectedStatus(selected);
    if (selected) {
      onChange(selected.value);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      <GenericCombobox<StatusOption>
        items={options}
        value={selectedStatus}
        onChange={handleStatusChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

