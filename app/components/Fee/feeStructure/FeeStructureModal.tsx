import { useEffect, useState } from 'react';
import { type FeeStructure, type CreateFeeStructureInput, type FeeComponent, ValueType } from '~/types/studentFee';
import { Plus, Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { ClassSelector } from '~/components/common/ClassSelector';
import { FeeCategorySelector } from '~/components/common/FeeCategorySelector';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { FormActions } from '~/components/common/form/FormActions';
import { AcademicYearSelector } from '~/components/common/AcademicYearSelector';

interface FeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFeeStructureInput) => void;
  initialData?: Partial<FeeStructure>;
  academicYear: string;
  isSubmitting?: boolean;
}

export function FeeStructureModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  academicYear,
  isSubmitting = false 
}: FeeStructureModalProps) {
  const [formData, setFormData] = useState<CreateFeeStructureInput>({
    academicYear: academicYear,
    classId: '',
    feeComponents: []
  });

  const [feeComponents, setFeeComponents] = useState<(FeeComponent & { key: string })[]>([]);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        academicYear: initialData.academicYear || academicYear,
        classId: initialData.classId || '',
        feeComponents: initialData.feeComponents || []
      });

      setFeeComponents((initialData.feeComponents || []).map(comp => ({
        ...comp,
        key: Math.random().toString(36).substr(2, 9)
      })));
    } else {
      setFormData({
        academicYear: academicYear,
        classId: '',
        feeComponents: []
      });
      setFeeComponents([]);
    }
  }, [initialData, isOpen, academicYear]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove the key property when submitting
    const dataToSubmit = {
      ...formData,
      feeComponents: feeComponents.map(({ key, ...rest }) => rest)
    };
    onSubmit(dataToSubmit);
  };

  const handleAddComponent = () => {
    const newComponent = {
      feeCategory: '',
      amount: 0,
      dueDay: 1,
      lateChargeType: ValueType.PERCENTAGE,
      lateChargeValue: 0,
      gracePeriod: 0,
      isOptional: false,
      discountAllowed: true,
      key: Math.random().toString(36).substr(2, 9)
    };
    
    setFeeComponents([...feeComponents, newComponent]);
  };

  const handleRemoveComponent = (index: number) => {
    const updatedComponents = [...feeComponents];
    updatedComponents.splice(index, 1);
    setFeeComponents(updatedComponents);
  };

  const updateComponent = (index: number, field: keyof FeeComponent, value: any) => {
    const updatedComponents = [...feeComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      [field]: value
    };
    setFeeComponents(updatedComponents);
  };

  const valueTypeOptions = {
    [ValueType.FIXED]: 'Fixed Amount',
    [ValueType.PERCENTAGE]: 'Percentage'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          {initialData?._id ? 'Edit Fee Structure' : 'Add New Fee Structure'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <AcademicYearSelector 
              value={formData.academicYear}
              onChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}
            />
            
            <ClassSelector
              label="Class"
              value={formData.classId}
              onChange={(classId) => setFormData(prev => ({ ...prev, classId }))}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Fee Components</h4>
              <button
                type="button"
                onClick={handleAddComponent}
                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Component
              </button>
            </div>

            {feeComponents.length === 0 && (
              <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                No fee components added. Click "Add Component" to begin.
              </div>
            )}

            {feeComponents.map((component, index) => (
              <div 
                key={component.key} 
                className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">Component #{index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => handleRemoveComponent(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <FeeCategorySelector
                    label="Fee Category"
                    value={component.feeCategory}
                    onChange={(categoryId) => updateComponent(index, 'feeCategory', categoryId)}
                    required
                    disabled={isSubmitting}
                  />
                  
                  <TextInput
                    label="Amount"
                    value={component.amount.toString()}
                    onChange={(value) => updateComponent(index, 'amount', Number(value))}
                    type="number"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <TextInput
                    label="Due Day (1-31)"
                    value={component.dueDay?.toString() || '1'}
                    onChange={(value) => updateComponent(index, 'dueDay', Number(value))}
                    type="number"
                    disabled={isSubmitting}
                  />
                  
                  <TextInput
                    label="Grace Period (days)"
                    value={component.gracePeriod?.toString() || '0'}
                    onChange={(value) => updateComponent(index, 'gracePeriod', Number(value))}
                    type="number"
                    disabled={isSubmitting}
                  />
                  
                  <TextInput
                    label="Late Charge Value"
                    value={component.lateChargeValue?.toString() || '0'}
                    onChange={(value) => updateComponent(index, 'lateChargeValue', Number(value))}
                    type="number"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectInput
                    label="Late Charge Type"
                    value={component.lateChargeType || ValueType.PERCENTAGE}
                    options={valueTypeOptions}
                    onChange={(value) => updateComponent(index, 'lateChargeType', value as ValueType)}
                    disabled={isSubmitting}
                  />
                  
                  <div className="flex items-center mt-8">
                    <input
                      type="checkbox"
                      id={`isOptional-${index}`}
                      checked={component.isOptional || false}
                      onChange={(e) => updateComponent(index, 'isOptional', e.target.checked)}
                      disabled={isSubmitting}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor={`isOptional-${index}`} className="ml-2 block text-sm text-gray-700">
                      Optional
                    </label>
                  </div>
                  
                  <div className="flex items-center mt-8">
                    <input
                      type="checkbox"
                      id={`discountAllowed-${index}`}
                      checked={component.discountAllowed !== false}
                      onChange={(e) => updateComponent(index, 'discountAllowed', e.target.checked)}
                      disabled={isSubmitting}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor={`discountAllowed-${index}`} className="ml-2 block text-sm text-gray-700">
                      Allow Discount
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <FormActions
              mode={initialData?._id ? 'edit' : 'create'}
              entityName="Fee Structure"
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
