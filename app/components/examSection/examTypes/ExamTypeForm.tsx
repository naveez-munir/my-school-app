import React, { useState, useEffect } from 'react';
import { TextInput } from '~/components/common/form/inputs/TextInput';

interface ExamTypeFormProps {
  initialData?: {
    name: string;
    weightAge: number;
    isActive: boolean;
  };
  onSubmit: (data: {
    name: string;
    weightAge: number;
    isActive: boolean;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ExamTypeForm: React.FC<ExamTypeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    name: '',
    weightAge: 0,
    isActive: true
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    weightAge?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear validation errors when field is changed
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: undefined
      });
    }
  };

  const validate = () => {
    const newErrors: {
      name?: string;
      weightAge?: string;
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.weightAge <= 0) {
      newErrors.weightAge = 'Weight age must be greater than 0';
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
      <TextInput
        label="Name *"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        placeholder="Enter exam type name"
        error={errors.name}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weight Age *
        </label>
        <input
          type="number"
          value={formData.weightAge}
          onChange={(e) => handleChange('weightAge', parseInt(e.target.value) || 0)}
          min="1"
          className={`mt-1 block w-full rounded-md border ${
            errors.weightAge ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2`}
        />
        {errors.weightAge && (
          <p className="mt-1 text-sm text-red-500">{errors.weightAge}</p>
        )}
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
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default ExamTypeForm;
