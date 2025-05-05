import { Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { type Experience } from '~/types/staff';
import { DocumentUploader } from '~/components/student/form/DocumentUploader';

interface ExperienceItemProps {
  index: number;
  experience: Experience;
  allExperience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
  isSubmitting: boolean;
  staffId?: string;
}

export function ExperienceItem({
  index,
  experience,
  allExperience,
  setExperience,
  isSubmitting,
  staffId = ""
}: ExperienceItemProps) {
  const handleChange = (field: keyof Experience, value: any) => {
    const updated = [...allExperience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const handleRemove = () => {
    const updated = [...allExperience];
    updated.splice(index, 1);
    setExperience(updated);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-medium">Experience #{index + 1}</h5>
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
          value={experience.institution || ''}
          onChange={(value) => handleChange('institution', value)}
          required
          disabled={isSubmitting}
        />
        
        <TextInput
          label="Position"
          value={experience.position}
          onChange={(value) => handleChange('position', value)}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <DateInput
          label="From Date"
          value={experience.fromDate ? new Date(experience.fromDate).toISOString().split('T')[0] : ''}
          onChange={(value) => handleChange('fromDate', new Date(value))}
          required
          disabled={isSubmitting}
        />
        
        <DateInput
          label="To Date"
          value={experience.toDate ? new Date(experience.toDate).toISOString().split('T')[0] : ''}
          onChange={(value) => handleChange('toDate', new Date(value))}
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-4">
        <TextArea
          label="Description"
          value={experience.description || ''}
          onChange={(value) => handleChange('description', value)}
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <DocumentUploader
          currentDocumentUrl={experience.experienceLatterUrl || ''}
          documentType="Experience Letter"
          onDocumentChange={(url) => handleChange('experienceLatterUrl', url)}
          folder={`staff/${staffId}/experience/${index}`}
          label="Experience Letter"
        />
      </div>
    </div>
  );
}
