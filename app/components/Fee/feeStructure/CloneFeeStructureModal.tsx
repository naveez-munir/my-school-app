import { useEffect, useState } from 'react';
import type { FeeStructure, CloneFeeStructureInput, FeeComponentOverride, PopulatedFeeComponent, FeeComponent } from '~/types/studentFee';
import { Trash2, Plus } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { ClassSelector } from '~/components/common/ClassSelector';
import { FeeCategorySelector } from '~/components/common/FeeCategorySelector';
import { FormActions } from '~/components/common/form/FormActions';
import { useClasses } from '~/hooks/useClassQueries';
import { useFeeCategories } from '~/hooks/useFeeCategoryQueries';

interface CloneFeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CloneFeeStructureInput) => void;
  sourceStructure: FeeStructure | null;
  isSubmitting?: boolean;
}

// Helper function to check if a component is populated
const isPopulatedComponent = (
  component: FeeComponent | PopulatedFeeComponent
): component is PopulatedFeeComponent => {
  return typeof component.feeCategory === 'object';
};

export function CloneFeeStructureModal({
  isOpen,
  onClose,
  onSubmit,
  sourceStructure,
  isSubmitting = false
}: CloneFeeStructureModalProps) {
  const { data: classes = [] } = useClasses();
  const { data: feeCategories = [] } = useFeeCategories();
  const [formData, setFormData] = useState<CloneFeeStructureInput>({
    newAcademicYear: '',
    newClassId: '',
    incrementPercentage: 0,
    componentOverrides: [],
    keepDiscounts: true
  });

  const [overrides, setOverrides] = useState<(FeeComponentOverride & { key: string })[]>([]);
  
  useEffect(() => {
    if (sourceStructure) {
      setFormData({
        newAcademicYear: sourceStructure.academicYear,
        newClassId: sourceStructure.classId,
        incrementPercentage: 0,
        componentOverrides: [],
        keepDiscounts: true
      });
      setOverrides([]);
    } else {
      setFormData({
        newAcademicYear: '',
        newClassId: '',
        incrementPercentage: 0,
        componentOverrides: [],
        keepDiscounts: true
      });
      setOverrides([]);
    }
  }, [sourceStructure, isOpen]);
  
  if (!isOpen || !sourceStructure) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove the key property when submitting
    const dataToSubmit = {
      ...formData,
      componentOverrides: overrides.map(({ key, ...rest }) => rest)
    };
    onSubmit(dataToSubmit);
  };

  const handleAddOverride = () => {
    const newOverride = {
      feeCategoryId: '',
      newAmount: 0,
      newDueDay: undefined,
      newLateChargeType: undefined,
      newLateChargeValue: undefined,
      key: Math.random().toString(36).substr(2, 9)
    };
    
    setOverrides([...overrides, newOverride]);
  };

  const handleRemoveOverride = (index: number) => {
    const updatedOverrides = [...overrides];
    updatedOverrides.splice(index, 1);
    setOverrides(updatedOverrides);
  };

  const updateOverride = (index: number, field: keyof FeeComponentOverride, value: any) => {
    const updatedOverrides = [...overrides];
    updatedOverrides[index] = {
      ...updatedOverrides[index],
      [field]: value
    };
    setOverrides(updatedOverrides);
  };

  // Get component names for display
  const getComponentNames = () => {
    if (!sourceStructure.feeComponents) return [];

    return sourceStructure.feeComponents.map(comp => {
      if (isPopulatedComponent(comp)) {
        return {
          id: comp.feeCategory._id,
          name: comp.feeCategory.name,
          amount: comp.amount
        };
      } else {
        const category = feeCategories.find(cat => cat._id === comp.feeCategory);
        return {
          id: comp.feeCategory,
          name: category?.name || `Category ID: ${comp.feeCategory}`,
          amount: comp.amount
        };
      }
    });
  };

  const componentList = getComponentNames();
  const sourceClassName = classes.find(c => c.id === sourceStructure.classId)?.className || sourceStructure.classId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          Clone Fee Structure
        </h3>

        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          <p>You are cloning the fee structure from:</p>
          <ul className="list-disc list-inside">
            <li>Academic Year: {sourceStructure.academicYear}</li>
            <li>Class: {sourceClassName}</li>
            <li>Components: {sourceStructure.feeComponents?.length || 0}</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <TextInput
              label="New Academic Year"
              value={formData.newAcademicYear}
              onChange={(value) => setFormData(prev => ({ ...prev, newAcademicYear: value }))}
              required
              type="number"
              disabled={isSubmitting}
            />
            
            <ClassSelector
              label="New Class (Optional)"
              value={formData.newClassId || ''}
              onChange={(classId) => setFormData(prev => ({ ...prev, newClassId: classId }))}
              disabled={isSubmitting}
              placeholder="Same as source class"
            />
          </div>

          <div className="mb-6">
            <TextInput
              label="Increment All Fees By Percentage"
              value={formData.incrementPercentage?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, incrementPercentage: Number(value) }))}
              type="number"
              disabled={isSubmitting}
            />
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="keepDiscounts"
                checked={formData.keepDiscounts !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, keepDiscounts: e.target.checked }))}
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="keepDiscounts" className="ml-2 block text-sm text-gray-700">
                Maintain discount settings from original structure
              </label>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Component Overrides (Optional)</h4>
              <button
                type="button"
                onClick={handleAddOverride}
                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Override
              </button>
            </div>

            {componentList.length > 0 && overrides.length === 0 && (
              <div className="bg-gray-50 p-4 text-gray-500 rounded-md">
                <p>Current fee components:</p>
                <ul className="list-disc list-inside mt-2">
                  {componentList.map((comp, idx) => (
                    <li key={idx}>{comp.name}: {comp.amount}</li>
                  ))}
                </ul>
              </div>
            )}

            {overrides.map((override, index) => (
              <div 
                key={override.key} 
                className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">Override #{index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => handleRemoveOverride(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <FeeCategorySelector
                    label="Fee Category to Override"
                    value={override.feeCategoryId}
                    onChange={(categoryId) => updateOverride(index, 'feeCategoryId', categoryId)}
                    required
                    disabled={isSubmitting}
                  />
                  
                  <TextInput
                    label="New Amount"
                    value={override.newAmount.toString()}
                    onChange={(value) => updateOverride(index, 'newAmount', Number(value))}
                    type="number"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    label="New Due Day (Optional)"
                    value={override.newDueDay?.toString() || ''}
                    onChange={(value) => updateOverride(index, 'newDueDay', value ? Number(value) : undefined)}
                    type="number"
                    disabled={isSubmitting}
                  />
                  
                  <TextInput
                    label="New Late Charge Value (Optional)"
                    value={override.newLateChargeValue?.toString() || ''}
                    onChange={(value) => updateOverride(index, 'newLateChargeValue', value ? Number(value) : undefined)}
                    type="number"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <FormActions
              mode="create"
              entityName="Fee Structure Clone"
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
