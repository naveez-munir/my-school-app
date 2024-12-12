import { useState } from 'react';
import { Modal } from '~/components/common/Modal';
import { ClassSelector } from '~/components/common/ClassSelector';
import { AcademicYearSelector } from '~/components/common/AcademicYearSelector';
import { Sparkles, Info } from 'lucide-react';
import type { AutoGenerateTimetableDto } from '~/types/timetable';

interface AutoGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: AutoGenerateTimetableDto) => void;
  isLoading?: boolean;
}

export function AutoGenerateModal({
  isOpen,
  onClose,
  onGenerate,
  isLoading = false
}: AutoGenerateModalProps) {
  const [formData, setFormData] = useState<AutoGenerateTimetableDto>({
    classId: '',
    academicYear: '',
    saveAsDraft: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof AutoGenerateTimetableDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.classId) {
      newErrors.classId = 'Class is required';
    }

    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onGenerate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Auto-Generate Timetable"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Intelligent Timetable Generation
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Our AI-powered algorithm will automatically create an optimized
                timetable based on your allocations and constraints.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ClassSelector
            label="Class"
            value={formData.classId}
            onChange={(value) => handleChange('classId', value)}
            required
            error={errors.classId}
          />

          <AcademicYearSelector
            label="Academic Year"
            value={formData.academicYear}
            onChange={(value) => handleChange('academicYear', value)}
            required
            error={errors.academicYear}
          />

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.saveAsDraft}
                onChange={(e) => handleChange('saveAsDraft', e.target.checked)}
                className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-900">
                Save as draft (recommended)
              </span>
            </label>
            <p className="text-xs text-gray-600 mt-2 ml-7">
              You can review and manually edit the generated timetable before activating it.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Prerequisites</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Periods must be configured</li>
                  <li>Subject allocations must exist for the selected class</li>
                  <li>Generation typically takes 1-5 seconds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Timetable
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

