import { useState, useEffect } from 'react';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { ExitStatus, StudentStatus, type AcademicInfoStepProps, type CreateStudentDto } from '~/types/student';
import { ClassSelector } from '~/components/common/ClassSelector';


export function AcademicInfoStep({ data, onComplete, onBack }: AcademicInfoStepProps) {
  const getInitialFormData = (data: Partial<CreateStudentDto>) => {
    return {
      class: data.class || '',
      rollNumber: data.rollNumber || '',
      enrollmentDate: data.enrollmentDate || '',
      exitStatus: data.exitStatus || ExitStatus.None,
      exitDate: data.exitStatus !== ExitStatus.None ? data.exitDate || '' : '',
      exitRemarks: data.exitStatus !== ExitStatus.None ? data.exitRemarks || '' : '',
      status: data.status || StudentStatus.Active,
      attendancePercentage: data.attendancePercentage?.toString() || ''
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData(data));
  const [showExitFields, setShowExitFields] = useState(formData.exitStatus !== ExitStatus.None);
  useEffect(() => {
    setFormData(getInitialFormData(data));
  }, [data]);

  useEffect(() => {
    setShowExitFields(formData.exitStatus !== ExitStatus.None);
  }, [formData.exitStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert attendance percentage to number if provided
    const processedData = {
      ...formData,
      attendancePercentage: formData.attendancePercentage 
        ? parseFloat(formData.attendancePercentage) 
        : undefined
    };
    
    onComplete(processedData);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Roll Number"
          value={formData.rollNumber}
          onChange={(value) => handleChange('rollNumber', value)}
        />

        <SelectInput<typeof StudentStatus>
          label="Student Status"
          value={formData.status}
          onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          options={StudentStatus}
          placeholder="Select Status"
          required
        />

        <DateInput
          label="Enrollment Date"
          value={formData.enrollmentDate}
          onChange={(value) => handleChange('enrollmentDate', value)}
        />

        <TextInput
          label="Attendance Percentage"
          value={formData.attendancePercentage}
          onChange={(value) => {
            // Only allow numbers between 0-100
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
              handleChange('attendancePercentage', value);
            } else if (value === '') {
              handleChange('attendancePercentage', '');
            }
          }}
          type="number"
          placeholder="0-100"
        />

        <ClassSelector
         // @ts-ignore
          value={formData.class._id }
          onChange={(classId) => handleChange('class', classId)}
          label="Class"
          required={true}
        />

        <SelectInput<typeof ExitStatus>
          label="Exit Status"
          value={formData.exitStatus}
          onChange={(value) => setFormData(prev => ({ ...prev, exitStatus: value }))}
          options={ExitStatus}
          placeholder="Select Exit Status"
        />

        {showExitFields && (
          <>
            <DateInput
              label="Exit Date"
              value={formData.exitDate}
              onChange={(value) => handleChange('exitDate', value)}
            />

            <div className="md:col-span-2">
              <TextArea
                label="Exit Remarks"
                value={formData.exitRemarks}
                onChange={(value) => handleChange('exitRemarks', value)}
                rows={3}
                placeholder="Reason for leaving the school"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );
}
