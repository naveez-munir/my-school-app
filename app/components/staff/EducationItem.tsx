import { Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { type EducationHistory } from '~/types/staff';

interface EducationItemProps {
  index: number;
  education: EducationHistory;
  educationHistory: EducationHistory[];
  setEducationHistory: React.Dispatch<React.SetStateAction<EducationHistory[]>>;
  isSubmitting: boolean;
}

export function EducationItem({
  index,
  education,
  educationHistory,
  setEducationHistory,
  isSubmitting
}: EducationItemProps) {
  const handleChange = (field: keyof EducationHistory, value: any) => {
    const updated = [...educationHistory];
    updated[index] = { ...updated[index], [field]: value };
    setEducationHistory(updated);
  };

  const handleRemove = () => {
    const updated = [...educationHistory];
    updated.splice(index, 1);
    setEducationHistory(updated);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-medium">Education #{index + 1}</h5>
        <button
          type="button"
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800"
          disabled={isSubmitting}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <TextInput
          label="Institution"
          value={education.institution}
          onChange={(value) => handleChange('institution', value)}
          required
          disabled={isSubmitting}
        />
        
        <TextInput
          label="Degree"
          value={education.degree}
          onChange={(value) => handleChange('degree', value)}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <TextInput
          label="Field of Study"
          value={education.fieldOfStudy || ''}
          onChange={(value) => handleChange('fieldOfStudy', value)}
          disabled={isSubmitting}
        />
        
        <TextInput
          label="Grade"
          value={education.grade || ''}
          onChange={(value) => handleChange('grade', value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <DateInput
          label="Start Date"
          value={education.startDate ? new Date(education.startDate).toISOString().split('T')[0] : ''}
          onChange={(value) => handleChange('startDate', new Date(value))}
          required
          disabled={isSubmitting}
        />
        
        <DateInput
          label="End Date"
          value={education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : ''}
          onChange={(value) => handleChange('endDate', new Date(value))}
          disabled={isSubmitting}
        />
      </div>
      
      <TextArea
        label="Description"
        value={education.description || ''}
        onChange={(value) => handleChange('description', value)}
        rows={3}
        disabled={isSubmitting}
      />
    </div>
  );
}
