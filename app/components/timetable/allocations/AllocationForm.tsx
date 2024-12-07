import { useState } from 'react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { FormActions } from '~/components/common/form/FormActions';
import { ClassSelector } from '~/components/common/ClassSelector';
import { SubjectSelector } from '~/components/common/SubjectSelector';
import { TeacherSelector } from '~/components/common/TeacherSelector';
import { AcademicYearSelector } from '~/components/common/AcademicYearSelector';
import { useCreateAllocation, useUpdateAllocation } from '~/hooks/useAllocationQueries';
import toast from 'react-hot-toast';
import type { ClassSubjectAllocation, CreateAllocationDto } from '~/types/timetable';

interface AllocationFormProps {
  allocation?: ClassSubjectAllocation;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AllocationForm({ allocation, onSuccess, onCancel }: AllocationFormProps) {
  const [formData, setFormData] = useState<CreateAllocationDto>({
    classId: allocation?.classId || '',
    subjectId: allocation?.subjectId || '',
    teacherId: allocation?.teacherId || '',
    academicYear: allocation?.academicYear || '',
    periodsPerWeek: allocation?.periodsPerWeek || 5,
    isLabSubject: allocation?.isLabSubject || false,
    consecutivePeriods: allocation?.consecutivePeriods || 1,
    status: allocation?.status || 'ACTIVE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createAllocationMutation = useCreateAllocation();
  const updateAllocationMutation = useUpdateAllocation();

  const handleChange = (field: keyof CreateAllocationDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.classId) {
      newErrors.classId = 'Class is required';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Teacher is required';
    }

    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }

    if (formData.periodsPerWeek < 1) {
      newErrors.periodsPerWeek = 'Periods per week must be at least 1';
    }

    if (formData.consecutivePeriods < 1) {
      newErrors.consecutivePeriods = 'Consecutive periods must be at least 1';
    }

    if (formData.consecutivePeriods > formData.periodsPerWeek) {
      newErrors.consecutivePeriods = 'Consecutive periods cannot exceed periods per week';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const mutation = allocation ? updateAllocationMutation : createAllocationMutation;
    const action = allocation ? 'update' : 'create';

    const submitData = allocation
      ? { id: allocation.id, data: formData }
      : formData;

    mutation.mutate(submitData as any, {
      onSuccess: () => {
        toast.success(`Allocation ${action === 'create' ? 'created' : 'updated'} successfully`);
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || `Failed to ${action} allocation`);
      }
    });
  };

  const isLoading = createAllocationMutation.isPending || updateAllocationMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClassSelector
          label="Class"
          value={formData.classId}
          onChange={(value) => handleChange('classId', value)}
          required
        />

        <SubjectSelector
          label="Subject"
          value={formData.subjectId}
          onChange={(value) => handleChange('subjectId', value)}
          classId={formData.classId}
          required
        />
      </div>

      <TeacherSelector
        label="Teacher"
        value={formData.teacherId}
        onChange={(value) => handleChange('teacherId', value)}
        required
      />

      <AcademicYearSelector
        label="Academic Year"
        value={formData.academicYear}
        onChange={(value) => handleChange('academicYear', value)}
        error={errors.academicYear}
        required
        placeholder="Select academic year"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Periods Per Week"
          type="number"
          value={String(formData.periodsPerWeek)}
          onChange={(value) => handleChange('periodsPerWeek', parseInt(value) || 1)}
          error={errors.periodsPerWeek}
          required
          placeholder="e.g., 5"
        />

        <TextInput
          label="Consecutive Periods"
          type="number"
          value={String(formData.consecutivePeriods)}
          onChange={(value) => handleChange('consecutivePeriods', parseInt(value) || 1)}
          error={errors.consecutivePeriods}
          required
          placeholder="e.g., 1"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isLabSubject"
            checked={formData.isLabSubject}
            onChange={(e) => handleChange('isLabSubject', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isLabSubject" className="ml-2 block text-sm text-gray-700">
            Lab Subject
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.status === 'ACTIVE'}
            onChange={(e) => handleChange('status', e.target.checked ? 'ACTIVE' : 'INACTIVE')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Consecutive periods indicate how many periods should be scheduled together 
          (e.g., for lab subjects that require 2-3 consecutive periods).
        </p>
      </div>

      <FormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        cancelText="Cancel"
        submitText={allocation ? 'Update Allocation' : 'Create Allocation'}
        loadingText={allocation ? 'Updating...' : 'Creating...'}
      />
    </form>
  );
}

