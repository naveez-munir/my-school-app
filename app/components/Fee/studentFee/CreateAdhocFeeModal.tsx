import { useState, useEffect } from 'react';
import type { CreateAdhocFeeInput } from '~/types/studentFee';
import { useFeeCategories } from '~/hooks/useFeeCategoryQueries';
import { ClassSelector } from '~/components/common/ClassSelector';
import { StudentSelector } from '~/components/common/StudentSelector';
import { AcademicYearSelector } from '~/components/common/AcademicYearSelector';
import { FormActions } from '~/components/common/form/FormActions';

interface CreateAdhocFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdhocFeeInput) => void;
  isSubmitting: boolean;
  preSelectedStudentId?: string;
  academicYear?: string;
}

export function CreateAdhocFeeModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  preSelectedStudentId,
  academicYear: initialAcademicYear
}: CreateAdhocFeeModalProps) {
  const [formData, setFormData] = useState<Partial<CreateAdhocFeeInput>>({
    studentId: preSelectedStudentId || '',
    academicYear: initialAcademicYear || '',
    description: '',
    amount: 0,
    dueDate: '',
    feeCategoryId: '',
    remarks: ''
  });

  const [selectedClass, setSelectedClass] = useState<string>('');
  const { data: feeCategories = [] } = useFeeCategories();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        studentId: preSelectedStudentId || '',
        academicYear: initialAcademicYear || '',
        description: '',
        amount: 0,
        dueDate: '',
        feeCategoryId: '',
        remarks: ''
      });
      setSelectedClass('');
    }
  }, [isOpen, preSelectedStudentId, initialAcademicYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.studentId && formData.academicYear && formData.description && formData.amount && formData.dueDate) {
      onSubmit(formData as CreateAdhocFeeInput);
    }
  };

  const handleChange = (field: keyof CreateAdhocFeeInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-3xl border-1 border-gray-200 z-10 relative max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Create Ad-hoc Fee</h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <ClassSelector
              label="Class"
              value={selectedClass}
              onChange={(classId) => setSelectedClass(classId)}
              placeholder="Select class first"
              required
              disabled={isSubmitting || !!preSelectedStudentId}
            />

            <StudentSelector
              label="Student"
              value={formData.studentId || ''}
              onChange={(studentId) => handleChange('studentId', studentId)}
              classId={selectedClass}
              required
              disabled={!selectedClass || isSubmitting || !!preSelectedStudentId}
            />

            <AcademicYearSelector
              value={formData.academicYear || ''}
              onChange={(value) => handleChange('academicYear', value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="e.g., Late admission fee, Special exam fee"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                min="0"
                step="0.01"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Category (Optional)
              </label>
              <select
                value={formData.feeCategoryId}
                onChange={(e) => handleChange('feeCategoryId', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
                disabled={isSubmitting}
              >
                <option value="">None</option>
                {feeCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                placeholder="Additional notes..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mt-6">
            <FormActions
              onCancel={onClose}
              isLoading={isSubmitting}
              submitText="Create Ad-hoc Fee"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

