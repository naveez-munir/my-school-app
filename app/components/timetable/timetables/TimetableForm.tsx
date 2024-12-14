import { useState } from 'react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { FormActions } from '~/components/common/form/FormActions';
import { ClassSelector } from '~/components/common/ClassSelector';
import { AcademicYearSelector } from '~/components/common/AcademicYearSelector';
import { useCreateTimetable } from '~/hooks/useTimetableQueries';
import toast from 'react-hot-toast';
import type { CreateTimetableDto } from '~/types/timetable';

interface TimetableFormProps {
  onSuccess: (timetableId: string) => void;
  onCancel: () => void;
}

export function TimetableForm({ onSuccess, onCancel }: TimetableFormProps) {
  const [formData, setFormData] = useState<CreateTimetableDto>({
    classId: '',
    academicYear: '',
    displayName: '',
    effectiveFrom: new Date().toISOString().split('T')[0],
    status: 'DRAFT',
    generationType: 'MANUAL',
    schedule: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createTimetableMutation = useCreateTimetable();

  const handleChange = (field: keyof CreateTimetableDto, value: any) => {
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

    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }

    if (!formData.displayName) {
      newErrors.displayName = 'Timetable name is required';
    }

    if (!formData.effectiveFrom) {
      newErrors.effectiveFrom = 'Effective from date is required';
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

    createTimetableMutation.mutate(formData, {
      onSuccess: (data) => {
        toast.success('Timetable created successfully');
        onSuccess(data.id);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create timetable');
      }
    });
  };

  const isLoading = createTimetableMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClassSelector
          label="Class"
          value={formData.classId}
          onChange={(value) => handleChange('classId', value)}
          error={errors.classId}
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
      </div>

      <TextInput
        label="Timetable Name"
        value={formData.displayName}
        onChange={(value) => handleChange('displayName', value)}
        error={errors.displayName}
        required
        placeholder="e.g., Grade 1 - Fall 2024"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInput
          label="Effective From"
          value={formData.effectiveFrom}
          onChange={(value) => handleChange('effectiveFrom', value)}
          error={errors.effectiveFrom}
          required
        />

        <DateInput
          label="Effective To (Optional)"
          value={formData.effectiveTo || ''}
          onChange={(value) => handleChange('effectiveTo', value)}
        />
      </div>

      <FormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        cancelText="Cancel"
        submitText="Create Timetable"
        loadingText="Creating..."
      />
    </form>
  );
}

