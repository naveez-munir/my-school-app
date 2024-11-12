import { useEffect, useState } from "react";
import { type CreateStudentDiscountInput, DiscountType, ValueType } from "~/types/studentFee";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { FormActions } from "~/components/common/form/FormActions";
import { useFeeCategories } from "~/hooks/useFeeCategoryQueries";

interface CreateDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentDiscountInput) => void;
  isSubmitting?: boolean;
  studentId: string;
}

export function CreateDiscountModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  studentId,
}: CreateDiscountModalProps) {
  const [formData, setFormData] = useState<CreateStudentDiscountInput>({
    studentId: "",
    discountType: DiscountType.MERIT,
    discountValueType: ValueType.PERCENTAGE,
    discountValue: 0,
    startDate: new Date().toISOString(),
    applicableCategories: [],
    remarks: "",
  });

  const [showCategorySelection, setShowCategorySelection] = useState<boolean>(false);

  const { data: feeCategories = [], isLoading: loadingCategories } = useFeeCategories({
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        studentId: studentId,
        discountType: DiscountType.MERIT,
        discountValueType: ValueType.PERCENTAGE,
        discountValue: 0,
        startDate: new Date().toISOString(),
        applicableCategories: [],
        remarks: "",
      });
      setShowCategorySelection(false);
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string dates to Date objects for API
    const payload: CreateStudentDiscountInput = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
    };

    onSubmit(payload);
  };

  const discountTypeOptions = {
    [DiscountType.MERIT]: "Merit Discount",
    [DiscountType.SIBLING]: "Sibling Discount",
    [DiscountType.STAFF_WARD]: "Staff Ward Discount",
    [DiscountType.FINANCIAL_AID]: "Financial Aid",
    [DiscountType.SCHOLARSHIP]: "Scholarship",
    [DiscountType.OTHER]: "Other",
  };

  const valueTypeOptions = {
    [ValueType.PERCENTAGE]: "Percentage",
    [ValueType.FIXED]: "Fixed Amount",
  };

  const toggleCategorySelection = () => {
    setShowCategorySelection(!showCategorySelection);
    if (!showCategorySelection) {
      setFormData((prev) => ({ ...prev, applicableCategories: [] }));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      const currentCategories = prev.applicableCategories || [];
      if (currentCategories.includes(categoryId)) {
        return {
          ...prev,
          applicableCategories: currentCategories.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prev,
          applicableCategories: [...currentCategories, categoryId],
        };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-xl border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">Create Student Discount</h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <SelectInput
              label="Discount Type"
              value={formData.discountType}
              options={discountTypeOptions}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, discountType: value as DiscountType }))
              }
              required
              disabled={isSubmitting}
            />

            <SelectInput
              label="Value Type"
              value={formData.discountValueType}
              options={valueTypeOptions}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, discountValueType: value as ValueType }))
              }
              required
              disabled={isSubmitting}
            />

            <TextInput
              label="Discount Value"
              value={formData.discountValue.toString()}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, discountValue: Number(value) }))
              }
              type="number"
              required
              disabled={isSubmitting}
              placeholder={formData.discountValueType === ValueType.PERCENTAGE ? "Enter percentage (0-100)" : "Enter amount"}
            />

            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="limitCategories"
                  checked={showCategorySelection}
                  onChange={toggleCategorySelection}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="limitCategories" className="ml-2 text-sm font-medium text-gray-700">
                  Limit discount to specific fee categories
                </label>
              </div>

              {showCategorySelection && (
                <div className="mt-2 p-3 border rounded-md">
                  <p className="text-sm text-gray-700 mb-2">Select applicable fee categories:</p>
                  {loadingCategories ? (
                    <p className="text-sm text-blue-500">Loading categories...</p>
                  ) : feeCategories.length === 0 ? (
                    <p className="text-sm text-gray-500">No fee categories available</p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto">
                      {feeCategories.map((category) => (
                        <div key={category._id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`category-${category._id}`}
                            checked={(formData.applicableCategories || []).includes(category._id)}
                            onChange={() => handleCategoryToggle(category._id)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label htmlFor={`category-${category._id}`} className="ml-2 text-sm text-gray-700">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <TextInput
              label="Start Date"
              value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, startDate: new Date(value).toISOString() }))
              }
              type="date"
              required
              disabled={isSubmitting}
            />

            <TextInput
              label="End Date (Optional)"
              value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  endDate: value ? new Date(value).toISOString() : undefined,
                }))
              }
              type="date"
              disabled={isSubmitting}
            />

            <TextInput
              label="Remarks (Optional)"
              value={formData.remarks || ''}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, remarks: value }))
              }
              type="text"
              disabled={isSubmitting}
              placeholder="Add any notes or comments about this discount"
            />
          </div>

          <div className="mt-6">
            <FormActions
              mode="create"
              entityName="Discount"
              onCancel={onClose}
              isLoading={isSubmitting}
              // onSubmit={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
