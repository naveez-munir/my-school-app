import { Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { type EducationHistory } from '~/types/staff';
import { DocumentUploader } from '~/components/student/form/DocumentUploader';

interface EducationItemProps {
  index: number;
  education: EducationHistory;
  educationHistory: EducationHistory[];
  setEducationHistory: React.Dispatch<React.SetStateAction<EducationHistory[]>>;
  isSubmitting: boolean;
  staffId?: string;
}

export function EducationItem({
  index,
  education,
  educationHistory,
  setEducationHistory,
  isSubmitting,
  staffId = ""
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
      
      <div className="mb-4">
        <TextInput
          label="Year"
          value={education.year ? education.year.toString() : ''}
          onChange={(value) => handleChange('year', parseInt(value))}
          type="number"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <DocumentUploader
          currentDocumentUrl={education.certificateUrl || ''}
          documentType="Degree Certificate"
          onDocumentChange={(url) => handleChange('certificateUrl', url)}
          folder={`staff/${staffId}/education/${index}`}
          label="Certificate"
        />
      </div>
    </div>
  );
}
