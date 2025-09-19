import React, { useState, useEffect } from 'react';

interface AcademicYearFormProps {
  initialData?: {
    startDate: string;
    endDate: string;
    displayName: string;
    isActive: boolean;
    status: 'Draft' | 'Active' | 'Closed';
  };
  onSubmit: (data: {
    startDate: string;
    endDate: string;
    displayName: string;
    isActive: boolean;
    status: 'Draft' | 'Active' | 'Closed';
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const AcademicYearForm: React.FC<AcademicYearFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    displayName: '',
    isActive: false,
    status: 'Draft' as 'Draft' | 'Active' | 'Closed'
  });

  const [errors, setErrors] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value
    };

    if (field === 'startDate' || field === 'endDate') {
      const startYear = field === 'startDate' ? new Date(value).getFullYear() : new Date(formData.startDate).getFullYear();
      const endYear = field === 'endDate' ? new Date(value).getFullYear() : new Date(formData.endDate).getFullYear();

      if (!isNaN(startYear) && !isNaN(endYear)) {
        updatedData.displayName = `${startYear}-${endYear}`;
      }
    }

    setFormData(updatedData);

    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: undefined
      });
    }
  };

  const validate = () => {
    const newErrors: {
      startDate?: string;
      endDate?: string;
    } = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Name *
        </label>
        <input
          type="text"
          value={formData.displayName}
          readOnly
          className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 cursor-not-allowed"
          placeholder="Auto-generated from dates"
        />
        <p className="mt-1 text-xs text-gray-500">Auto-generated from start and end dates</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date *
        </label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.startDate ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2`}
        />
        {errors.startDate && (
          <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date *
        </label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.endDate ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2`}
        />
        {errors.endDate && (
          <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default AcademicYearForm;
