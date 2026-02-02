import { Plus } from 'lucide-react';
import type { Control, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import type { CreateStaffFormData } from '~/utils/validation/staffValidation';
import { EducationItem } from './EducationItem';
import { ExperienceItem } from './ExperienceItem';

interface EducationExperienceTabProps {
  control: Control<CreateStaffFormData>;
  errors: FieldErrors<CreateStaffFormData>;
  educationFieldArray: UseFieldArrayReturn<CreateStaffFormData, 'educationHistory'>;
  experienceFieldArray: UseFieldArrayReturn<CreateStaffFormData, 'experience'>;
  isSubmitting: boolean;
  staffId?: string;
}

export function EducationExperienceTab({
  control,
  errors,
  educationFieldArray,
  experienceFieldArray,
  isSubmitting,
  staffId = ""
}: EducationExperienceTabProps) {
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = educationFieldArray;
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = experienceFieldArray;

  const handleAddEducation = () => {
    appendEducation({
      degree: '',
      institution: '',
      year: new Date().getFullYear(),
      certificateUrl: ''
    });
  };

  const handleAddExperience = () => {
    appendExperience({
      institution: '',
      position: '',
      fromDate: new Date().toISOString().split('T')[0],
      toDate: undefined,
      description: '',
      experienceLatterUrl: ''
    });
  };

  return (
    <div className="space-y-6">

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium">Education History</h4>
          <button
            type="button"
            onClick={handleAddEducation}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Education
          </button>
        </div>

        {educationFields.length === 0 ? (
          <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
            No education history added.
          </div>
        ) : (
          educationFields.map((field, index) => (
            <EducationItem
              key={field.id}
              index={index}
              control={control}
              errors={errors}
              onRemove={() => removeEducation(index)}
              isSubmitting={isSubmitting}
              staffId={staffId}
            />
          ))
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium">Work Experience</h4>
          <button
            type="button"
            onClick={handleAddExperience}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Experience
          </button>
        </div>

        {experienceFields.length === 0 ? (
          <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
            No work experience added.
          </div>
        ) : (
          experienceFields.map((field, index) => (
            <ExperienceItem
              key={field.id}
              index={index}
              control={control}
              errors={errors}
              onRemove={() => removeExperience(index)}
              isSubmitting={isSubmitting}
              staffId={staffId}
            />
          ))
        )}
      </div>
    </div>
  );
}
