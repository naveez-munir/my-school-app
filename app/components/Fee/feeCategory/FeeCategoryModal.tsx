import { useEffect, useState } from 'react';
import { FormActions } from '~/components/common/form/FormActions';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { type FeeCategory, type CreateFeeCategoryInput, FeeFrequency } from '~/types/studentFee';

interface FeeCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFeeCategoryInput) => void;
  initialData?: Partial<FeeCategory>;
  isSubmitting?: boolean;
}

export function FeeCategoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  isSubmitting = false 
}: FeeCategoryModalProps) {
  const [formData, setFormData] = useState<CreateFeeCategoryInput>({
    name: '',
    frequency: FeeFrequency.MONTHLY,
    isRefundable: false,
    description: ''
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        frequency: initialData.frequency || FeeFrequency.MONTHLY,
        isRefundable: initialData.isRefundable ?? false,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        frequency: FeeFrequency.MONTHLY,
        isRefundable: false,
        description: ''
      });
    }
  }, [initialData, isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const frequencyOptions = {
    [FeeFrequency.ONE_TIME]: 'ONE_TIME',
    [FeeFrequency.MONTHLY]: 'MONTHLY',
    [FeeFrequency.QUARTERLY]: 'QUARTERLY',
    [FeeFrequency.YEARLY]: 'YEARLY'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          {initialData?._id ? 'Edit Fee Category' : 'Add New Fee Category'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <TextInput
              label="Category Name"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              required
              placeholder="Enter category name"
              disabled={isSubmitting}
            />
            
            <SelectInput
              label="Frequency"
              value={formData.frequency}
              options={frequencyOptions}
              onChange={(value) => setFormData(prev => ({ ...prev, frequency: value as FeeFrequency }))}
              required
              disabled={isSubmitting}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRefundable"
                checked={formData.isRefundable}
                onChange={(e) => setFormData(prev => ({ ...prev, isRefundable: e.target.checked }))}
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isRefundable" className="ml-2 block text-sm text-gray-700">
                Is Refundable
              </label>
            </div>
            
            <TextArea
              label="Description"
              value={formData.description || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Enter description (optional)"
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="mt-6">
            <FormActions
              mode={initialData?._id ? 'edit' : 'create'}
              entityName="Fee Category"
              onCancel={onClose}
              isLoading={isSubmitting}
              onSubmit={undefined}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
