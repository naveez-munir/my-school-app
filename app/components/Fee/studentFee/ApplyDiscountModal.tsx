import { useEffect, useState } from 'react';
import { FormActions } from '~/components/common/form/FormActions';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { type StudentFee, type PopulatedStudentFee, type ApplyDiscountInput, DiscountType, type FeeDetail, type PopulatedFeeDetail } from '~/types/studentFee';
import { formatCurrency } from '~/types/studentFee';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

// Use a type alias for fees that can be either populated or not
type AnyStudentFee = StudentFee | PopulatedStudentFee;

interface ApplyDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplyDiscountInput) => void;
  fee: AnyStudentFee | null;
  isSubmitting?: boolean;
}

export function ApplyDiscountModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  fee,
  isSubmitting = false
}: ApplyDiscountModalProps) {
  const [formData, setFormData] = useState<ApplyDiscountInput>({
    feeCategoryId: '',
    discountType: DiscountType.MERIT,
    discountAmount: 0
  });
  
  useEffect(() => {
    // Reset form data when modal opens
    if (isOpen && fee) {
      setFormData({
        feeCategoryId: fee.feeDetails.length > 0 ? 
          (typeof fee.feeDetails[0].feeCategory === 'object' ? 
            fee.feeDetails[0].feeCategory._id : fee.feeDetails[0].feeCategory) : '',
        discountType: DiscountType.MERIT,
        discountAmount: 0
      });
    }
  }, [isOpen, fee]);
  
  if (!isOpen || !fee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const discountTypeOptions = {
    [DiscountType.MERIT]: 'Merit Discount',
    [DiscountType.SIBLING]: 'Sibling Discount',
    [DiscountType.STAFF_WARD]: 'Staff Ward Discount',
    [DiscountType.FINANCIAL_AID]: 'Financial Aid',
    [DiscountType.SCHOLARSHIP]: 'Scholarship',
    [DiscountType.OTHER]: 'Other Discount'
  };

  // Get student name for display
  const getStudentName = () => {
    const student = fee.studentId;
    if (typeof student === 'object' && student !== null) {
      return `${student.firstName} ${student.lastName}`;
    }
    return `Student ID: ${student}`;
  };

  // Get eligible fee categories for discount (those with discountAllowed)
  const getEligibleFeeCategories = () => {
    return fee.feeDetails.map(detail => {
      // Check if detail has the populated category
      if (typeof detail.feeCategory === 'object' && detail.feeCategory !== null) {
        return { 
          id: detail.feeCategory._id, 
          name: detail.feeCategory.name,
          originalAmount: detail.originalAmount,
          netAmount: detail.netAmount,
          discountAmount: detail.discountAmount
        };
      } else {
        // If not populated, we only have the ID
        return { 
          id: detail.feeCategory, 
          name: `Category ID: ${detail.feeCategory}`,
          originalAmount: detail.originalAmount,
          netAmount: detail.netAmount,
          discountAmount: detail.discountAmount
        };
      }
    });
  };

  const feeCategories = getEligibleFeeCategories();

  // Find the selected category
  const selectedCategory = feeCategories.find(cat => cat.id === formData.feeCategoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          Apply Discount
        </h3>
        
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <h4 className="font-medium text-blue-700">Fee Details</h4>
          <div className="mt-2 space-y-1">
            <p><span className="font-medium">Student:</span> {getStudentName()}</p>
            <p><span className="font-medium">Bill Type:</span> {fee.billType}</p>
            <p><span className="font-medium">Due Date:</span> {formatUserFriendlyDate(fee.dueDate)}</p>
            <p><span className="font-medium">Total Amount:</span> {formatCurrency(fee.totalAmount)}</p>
            <p><span className="font-medium">Current Discount:</span> {formatCurrency(fee.totalDiscount)}</p>
            <p><span className="font-medium">Net Amount:</span> {formatCurrency(fee.netAmount)}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {feeCategories.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fee Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.feeCategoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, feeCategoryId: e.target.value }))}
                  disabled={isSubmitting}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
                >
                  <option value="">Select Fee Category</option>
                  {feeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({formatCurrency(category.originalAmount)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 text-yellow-700 rounded">
                No fee categories available for discount.
              </div>
            )}
            
            <SelectInput
              label="Discount Type"
              value={formData.discountType}
              options={discountTypeOptions}
              onChange={(value) => setFormData(prev => ({ ...prev, discountType: value as DiscountType }))}
              required
              disabled={isSubmitting}
            />
            
            <TextInput
              label="Discount Amount"
              value={formData.discountAmount.toString()}
              onChange={(value) => setFormData(prev => ({ ...prev, discountAmount: Number(value) }))}
              type="number"
              placeholder="Enter discount amount"
              required
              disabled={isSubmitting}
            />
            
            {selectedCategory && (
              <div className="p-3 border rounded bg-gray-50">
                <p className="text-sm text-gray-600">
                  Current price: {formatCurrency(selectedCategory.originalAmount)}
                </p>
                <p className="text-sm text-gray-600">
                  Current discount: {formatCurrency(selectedCategory.discountAmount)}
                </p>
                <p className="text-sm font-medium">
                  New price after discount: {formatCurrency(selectedCategory.originalAmount - formData.discountAmount)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <FormActions
              mode="create"
              entityName="Discount"
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
