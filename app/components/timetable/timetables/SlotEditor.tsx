import { useState, useEffect, useMemo } from 'react';
import { Modal } from '~/components/common/Modal';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { FormActions } from '~/components/common/form/FormActions';
import GenericCombobox from '~/components/common/form/inputs/Select';
import type { TimetableSlot, ClassSubjectAllocation, Period } from '~/types/timetable';

interface SlotEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: TimetableSlot) => void;
  dayOfWeek: number;
  periodNumber: number;
  periodId: string;
  existingSlot?: TimetableSlot;
  allocations: ClassSubjectAllocation[];
  periods: Period[];
}

// Using 0-6 format (Sunday=0, Saturday=6) to match backend and JavaScript Date standard
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SlotEditor({
  isOpen,
  onClose,
  onSave,
  dayOfWeek,
  periodNumber,
  periodId,
  existingSlot,
  allocations,
  periods,
}: SlotEditorProps) {
  const [formData, setFormData] = useState<TimetableSlot>({
    dayOfWeek,
    periodNumber,
    periodId,
    subjectId: existingSlot?.subjectId || '',
    teacherId: existingSlot?.teacherId || '',
    room: existingSlot?.room || '',
    notes: existingSlot?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedAllocation, setSelectedAllocation] = useState<ClassSubjectAllocation | null>(null);
  const [selectedSubjectOption, setSelectedSubjectOption] = useState<{ value: string; label: string } | null>(null);

  const period = useMemo(() => {
    return periods.find(p => p.id === periodId);
  }, [periods, periodId]);

  const subjectOptions = useMemo(() => {
    return allocations.map(allocation => ({
      value: allocation.subjectId,
      label: allocation.subjectName,
    }));
  }, [allocations]);

  useEffect(() => {
    if (existingSlot) {
      const allocation = allocations.find(
        a => a.subjectId === existingSlot.subjectId
      );
      setSelectedAllocation(allocation || null);

      if (allocation) {
        const option = subjectOptions.find(opt => opt.value === allocation.subjectId);
        setSelectedSubjectOption(option || null);
      }
    }
  }, [existingSlot, allocations, subjectOptions]);

  const handleSubjectChange = (selected: { value: string; label: string } | null) => {
    setSelectedSubjectOption(selected);

    if (selected) {
      const allocation = allocations.find(a => a.subjectId === selected.value);

      if (allocation) {
        setSelectedAllocation(allocation);
        setFormData(prev => ({
          ...prev,
          subjectId: allocation.subjectId,
          teacherId: allocation.teacherId,
        }));

        if (errors.subjectId) {
          setErrors(prev => ({ ...prev, subjectId: '' }));
        }
      }
    } else {
      setSelectedAllocation(null);
      setFormData(prev => ({
        ...prev,
        subjectId: '',
        teacherId: '',
      }));
    }
  };

  const handleChange = (field: keyof TimetableSlot, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Teacher is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const slot: TimetableSlot = {
      dayOfWeek,
      periodNumber,
      periodId,
      subjectId: formData.subjectId,
      teacherId: formData.teacherId,
      room: formData.room,
      notes: formData.notes,
    };

    onSave(slot);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${existingSlot ? 'Edit' : 'Add'} Slot - ${DAY_NAMES[dayOfWeek]} ${period?.periodName}`}
      size="md"
      closeOnOutsideClick={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold">Day:</span> {DAY_NAMES[dayOfWeek]}
            </div>
            <div>
              <span className="font-semibold">Period:</span> {period?.periodName}
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Time:</span> {period?.startTime} - {period?.endTime}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Subject<span className="text-red-500">*</span>
          </label>
          <GenericCombobox<{ value: string; label: string }>
            items={subjectOptions}
            value={selectedSubjectOption}
            onChange={handleSubjectChange}
            displayKey="label"
            valueKey="value"
            placeholder="Select subject"
          />
          {errors.subjectId && (
            <p className="mt-1 text-sm text-red-500">{errors.subjectId}</p>
          )}
        </div>

        {selectedAllocation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm">
              <div className="font-semibold text-blue-900">Assigned Teacher:</div>
              <div className="text-blue-800 mt-1">{selectedAllocation.teacherName}</div>
              <div className="text-xs text-blue-600 mt-2">
                Periods per week: {selectedAllocation.periodsPerWeek}
                {selectedAllocation.isLabSubject && ' • Lab Subject'}
              </div>
            </div>
          </div>
        )}

        <TextInput
          label="Room (Optional)"
          value={formData.room || ''}
          onChange={(value) => handleChange('room', value)}
          placeholder="e.g., Room 101, Lab A"
        />

        <TextInput
          label="Notes (Optional)"
          value={formData.notes || ''}
          onChange={(value) => handleChange('notes', value)}
          placeholder="Any additional notes"
        />

        <FormActions
          onCancel={onClose}
          isLoading={false}
          cancelText="Cancel"
          submitText={existingSlot ? 'Update Slot' : 'Add Slot'}
        />
      </form>
    </Modal>
  );
}

