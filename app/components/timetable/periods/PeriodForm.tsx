import { useState, useEffect } from 'react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { FormActions } from '~/components/common/form/FormActions';
import { useCreatePeriod, useUpdatePeriod } from '~/hooks/usePeriodQueries';
import toast from 'react-hot-toast';
import type { Period, CreatePeriodDto, PeriodType } from '~/types/timetable';

interface PeriodFormProps {
  period?: Period;
  onSuccess: () => void;
  onCancel: () => void;
}

const PERIOD_TYPES: Record<PeriodType, string> = {
  TEACHING: 'Teaching',
  BREAK: 'Break',
  LUNCH: 'Lunch',
  ASSEMBLY: 'Assembly',
};

export function PeriodForm({ period, onSuccess, onCancel }: PeriodFormProps) {
  const [formData, setFormData] = useState<CreatePeriodDto>({
    periodNumber: period?.periodNumber || 1,
    periodName: period?.periodName || '',
    startTime: period?.startTime || '',
    endTime: period?.endTime || '',
    periodType: period?.periodType || 'TEACHING',
    isActive: period?.isActive ?? true,
    notes: period?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createPeriodMutation = useCreatePeriod();
  const updatePeriodMutation = useUpdatePeriod();

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes - startMinutes;
  };

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const duration = calculateDuration(formData.startTime, formData.endTime);
      if (duration > 0) {
        setFormData(prev => ({ ...prev, durationMinutes: duration }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (field: keyof CreatePeriodDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.periodName.trim()) {
      newErrors.periodName = 'Period name is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const duration = calculateDuration(formData.startTime, formData.endTime);
      if (duration <= 0) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (formData.periodNumber < 1) {
      newErrors.periodNumber = 'Period number must be at least 1';
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

    const mutation = period ? updatePeriodMutation : createPeriodMutation;
    const action = period ? 'update' : 'create';

    const submitData = period
      ? { id: period.id, data: formData }
      : formData;

    mutation.mutate(submitData as any, {
      onSuccess: () => {
        toast.success(`Period ${action === 'create' ? 'created' : 'updated'} successfully`);
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || `Failed to ${action} period`);
      }
    });
  };

  const isLoading = createPeriodMutation.isPending || updatePeriodMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Period Number"
          type="number"
          value={String(formData.periodNumber)}
          onChange={(value) => handleChange('periodNumber', parseInt(value) || 1)}
          error={errors.periodNumber}
          required
          placeholder="e.g., 1"
        />

        <TextInput
          label="Period Name"
          value={formData.periodName}
          onChange={(value) => handleChange('periodName', value)}
          error={errors.periodName}
          required
          placeholder="e.g., Period 1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Start Time<span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
              errors.startTime
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            End Time<span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
              errors.endTime
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="Period Type"
          value={formData.periodType}
          options={PERIOD_TYPES}
          onChange={(value) => handleChange('periodType', value as PeriodType)}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={formData.durationMinutes || calculateDuration(formData.startTime, formData.endTime)}
            disabled
            className="mt-1 block w-full rounded-md shadow-sm p-2 bg-gray-100 border-gray-300 text-gray-600"
          />
          <p className="text-xs text-gray-500">Calculated automatically</p>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Active
        </label>
      </div>

      <TextArea
        label="Notes"
        value={formData.notes || ''}
        onChange={(value) => handleChange('notes', value)}
        placeholder="Optional notes about this period"
        rows={3}
      />

      <FormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        cancelText="Cancel"
        submitText={period ? 'Update Period' : 'Create Period'}
        loadingText={period ? 'Updating...' : 'Creating...'}
      />
    </form>
  );
}

