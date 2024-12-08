import { useState, useEffect, useMemo } from 'react';
import { Modal } from '~/components/common/Modal';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { FormActions } from '~/components/common/form/FormActions';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { TeacherSelector } from '~/components/common/TeacherSelector';
import { useClasses } from '~/hooks/useClassQueries';
import { useAcademicYears } from '~/hooks/useAcademicYearQueries';
import { useTimetableByClass } from '~/hooks/useTimetableQueries';
import { usePeriods } from '~/hooks/usePeriodQueries';
import type { TimetableException, CreateExceptionDto, ExceptionType } from '~/types/timetable';

interface ExceptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateExceptionDto) => void;
  existingException?: TimetableException;
}

const EXCEPTION_TYPES: { value: ExceptionType; label: string }[] = [
  { value: 'SUBSTITUTION', label: 'Substitution' },
  { value: 'CANCELLATION', label: 'Cancellation' },
  { value: 'RESCHEDULE', label: 'Reschedule' },
];

export function ExceptionForm({ isOpen, onClose, onSave, existingException }: ExceptionFormProps) {
  const [formData, setFormData] = useState<CreateExceptionDto>({
    timetableId: existingException?.timetableId || '',
    classId: existingException?.classId || '',
    exceptionDate: existingException?.exceptionDate || '',
    dayOfWeek: existingException?.dayOfWeek || 1,
    periodNumber: existingException?.periodNumber || 1,
    originalTeacherId: existingException?.originalTeacherId || '',
    originalSubjectId: existingException?.originalSubjectId || '',
    replacementTeacherId: existingException?.replacementTeacherId || '',
    replacementSubjectId: existingException?.replacementSubjectId || '',
    replacementRoom: existingException?.replacementRoom || '',
    exceptionType: existingException?.exceptionType || 'SUBSTITUTION',
    reason: existingException?.reason || '',
    notes: existingException?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedClassOption, setSelectedClassOption] = useState<{ value: string; label: string } | null>(null);
  const [selectedPeriodOption, setSelectedPeriodOption] = useState<{ value: number; label: string } | null>(null);
  const [selectedExceptionType, setSelectedExceptionType] = useState<{ value: ExceptionType; label: string } | null>(null);

  const { data: classes = [] } = useClasses();
  const { data: academicYears = [] } = useAcademicYears();
  const { data: periods = [] } = usePeriods(true);

  const activeAcademicYear = useMemo(() => {
    return academicYears.find(ay => ay.isActive);
  }, [academicYears]);

  const { data: timetable } = useTimetableByClass(
    formData.classId,
    activeAcademicYear?.year
  );

  const classOptions = useMemo(() => {
    return classes.map(cls => ({
      value: cls.id,
      label: `${cls.className}-${cls.classSection}`
    }));
  }, [classes]);

  const periodOptions = useMemo(() => {
    return periods.map(period => ({
      value: period.periodNumber,
      label: `${period.periodName} (${period.startTime} - ${period.endTime})`
    }));
  }, [periods]);

  const selectedSlot = useMemo(() => {
    if (!timetable || !formData.exceptionDate) return null;

    const date = new Date(formData.exceptionDate);
    const dayOfWeek = date.getDay();

    return timetable.schedule?.find(
      slot => slot.dayOfWeek === dayOfWeek && slot.periodNumber === formData.periodNumber
    );
  }, [timetable, formData.exceptionDate, formData.periodNumber]);

  useEffect(() => {
    if (selectedSlot) {
      setFormData(prev => ({
        ...prev,
        originalTeacherId: selectedSlot.teacherId,
        originalSubjectId: selectedSlot.subjectId,
        dayOfWeek: selectedSlot.dayOfWeek,
      }));
    }
  }, [selectedSlot]);

  useEffect(() => {
    if (existingException) {
      const classOption = classOptions.find(opt => opt.value === existingException.classId);
      setSelectedClassOption(classOption || null);

      const periodOption = periodOptions.find(opt => opt.value === existingException.periodNumber);
      setSelectedPeriodOption(periodOption || null);

      const exceptionTypeOption = EXCEPTION_TYPES.find(opt => opt.value === existingException.exceptionType);
      setSelectedExceptionType(exceptionTypeOption || null);
    }
  }, [existingException, classOptions, periodOptions]);

  const handleChange = (field: keyof CreateExceptionDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClassChange = (selected: { value: string; label: string } | null) => {
    setSelectedClassOption(selected);
    if (selected) {
      handleChange('classId', selected.value);
    }
  };

  const handlePeriodChange = (selected: { value: number; label: string } | null) => {
    setSelectedPeriodOption(selected);
    if (selected) {
      handleChange('periodNumber', selected.value);
    }
  };

  const handleExceptionTypeChange = (selected: { value: ExceptionType; label: string } | null) => {
    setSelectedExceptionType(selected);
    if (selected) {
      handleChange('exceptionType', selected.value);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.classId) newErrors.classId = 'Class is required';
    if (!formData.exceptionDate) newErrors.exceptionDate = 'Date is required';
    if (!formData.periodNumber) newErrors.periodNumber = 'Period is required';
    if (!formData.exceptionType) newErrors.exceptionType = 'Exception type is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';

    if (formData.exceptionType === 'SUBSTITUTION' && !formData.replacementTeacherId) {
      newErrors.replacementTeacherId = 'Replacement teacher is required for substitution';
    }

    if (!timetable?.id) {
      newErrors.classId = 'No active timetable found for this class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const exceptionData: CreateExceptionDto = {
      ...formData,
      timetableId: timetable!.id,
    };

    onSave(exceptionData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingException ? 'Edit Exception' : 'Create Exception'}
      size="lg"
      closeOnOutsideClick={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Class<span className="text-red-500">*</span>
            </label>
            <GenericCombobox<{ value: string; label: string }>
              items={classOptions}
              value={selectedClassOption}
              onChange={handleClassChange}
              displayKey="label"
              valueKey="value"
              placeholder="Select class"
            />
            {errors.classId && (
              <p className="mt-1 text-sm text-red-500">{errors.classId}</p>
            )}
          </div>

          <DateInput
            label="Exception Date"
            value={formData.exceptionDate}
            onChange={(value) => handleChange('exceptionDate', value)}
            error={errors.exceptionDate}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Period<span className="text-red-500">*</span>
            </label>
            <GenericCombobox<{ value: number; label: string }>
              items={periodOptions}
              value={selectedPeriodOption}
              onChange={handlePeriodChange}
              displayKey="label"
              valueKey="value"
              placeholder="Select period"
            />
            {errors.periodNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.periodNumber}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Exception Type<span className="text-red-500">*</span>
            </label>
            <GenericCombobox<{ value: ExceptionType; label: string }>
              items={EXCEPTION_TYPES}
              value={selectedExceptionType}
              onChange={handleExceptionTypeChange}
              displayKey="label"
              valueKey="value"
              placeholder="Select exception type"
            />
            {errors.exceptionType && (
              <p className="mt-1 text-sm text-red-500">{errors.exceptionType}</p>
            )}
          </div>
        </div>

        {selectedSlot && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Original Schedule</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Teacher:</span>
                <span className="text-blue-900 ml-2">{selectedSlot.teacherName}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Subject:</span>
                <span className="text-blue-900 ml-2">{selectedSlot.subjectName}</span>
              </div>
            </div>
          </div>
        )}

        {formData.exceptionType === 'SUBSTITUTION' && (
          <>
            <TeacherSelector
              label="Replacement Teacher"
              value={formData.replacementTeacherId}
              onChange={(teacherId) => handleChange('replacementTeacherId', teacherId)}
              placeholder="Select replacement teacher"
              required
              error={errors.replacementTeacherId}
            />

            <TextInput
              label="Replacement Room (Optional)"
              value={formData.replacementRoom || ''}
              onChange={(value) => handleChange('replacementRoom', value)}
              placeholder="e.g., Room 101"
            />
          </>
        )}

        <TextInput
          label="Reason"
          value={formData.reason}
          onChange={(value) => handleChange('reason', value)}
          error={errors.reason}
          required
          placeholder="e.g., Teacher on leave, Medical emergency"
        />

        <TextInput
          label="Notes (Optional)"
          value={formData.notes || ''}
          onChange={(value) => handleChange('notes', value)}
          placeholder="Additional notes"
        />

        <FormActions
          onCancel={onClose}
          isLoading={false}
          cancelText="Cancel"
          submitText={existingException ? 'Update Exception' : 'Create Exception'}
        />
      </form>
    </Modal>
  );
}
