import React from 'react';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import type { SubjectSchedule } from '~/types/exam';
import { SubjectSelector } from '~/components/common/SubjectSelector';

interface SubjectScheduleItemProps {
  subject: SubjectSchedule;
  index: number;
  formErrors: Record<string, string>;
  onSubjectChange: (index: number, field: keyof SubjectSchedule, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const SubjectScheduleItem: React.FC<SubjectScheduleItemProps> = ({
  subject,
  index,
  formErrors,
  onSubjectChange,
  onRemove,
  canRemove
}) => {

  return (
    <div className="mb-6 p-4 border rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Subject {index + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-4">
        <SubjectSelector 
          value={subject.subject}
          onChange={(value) => onSubjectChange(index, 'subject', value)}
        />
        
        {/* Exam Date */}
        <div>
          <DateInput
            label="Exam Date *"
            value={subject.examDate as string}
            onChange={(value) => onSubjectChange(index, 'examDate', value)}
            error={formErrors[`subjects[${index}].examDate`]}
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-4">
        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time *
          </label>
          <input
            type="time"
            value={subject.startTime as string}
            onChange={(e) => onSubjectChange(index, 'startTime', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              formErrors[`subjects[${index}].startTime`] ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 focus:border-blue-500 focus:ring-blue-500`}
          />
          {formErrors[`subjects[${index}].startTime`] && (
            <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].startTime`]}</p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time *
          </label>
          <input
            type="time"
            value={subject.endTime as string}
            onChange={(e) => onSubjectChange(index, 'endTime', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              formErrors[`subjects[${index}].endTime`] ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 focus:border-blue-500 focus:ring-blue-500`}
          />
          {formErrors[`subjects[${index}].endTime`] && (
            <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].endTime`]}</p>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Max Marks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks *</label>
          <input
            type="number"
            value={subject.maxMarks}
            onChange={(e) => onSubjectChange(index, 'maxMarks', parseInt(e.target.value, 10) || 0)}
            min="0"
            className={`mt-1 block w-full rounded-md border ${
              formErrors[`subjects[${index}].maxMarks`] ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2`}
          />
          {formErrors[`subjects[${index}].maxMarks`] && (
            <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].maxMarks`]}</p>
          )}
        </div>
        
        {/* Passing Marks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks *</label>
          <input
            type="number"
            value={subject.passingMarks}
            onChange={(e) => onSubjectChange(index, 'passingMarks', parseInt(e.target.value, 10) || 0)}
            min="0"
            className={`mt-1 block w-full rounded-md border ${
              formErrors[`subjects[${index}].passingMarks`] ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2`}
          />
          {formErrors[`subjects[${index}].passingMarks`] && (
            <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].passingMarks`]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectScheduleItem;
