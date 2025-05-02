import { Plus, X } from 'lucide-react';
import type { Experience } from '~/types/teacher';
import { TextInput } from '../common/form/inputs/TextInput';
import { DateInput } from '../common/form/inputs/DateInput';
import { TextArea } from '../common/form/inputs/TextArea';
import { DocumentUploader } from '../student/form/DocumentUploader';

interface ExperienceFormProps {
  data: Experience[];
  onUpdate: (value: Experience[]) => void;
}

export function ExperienceForm({ data = [], onUpdate }: ExperienceFormProps) {
  const handleAdd = () => {
    onUpdate([...data, {
      institution: '',
      position: '',
      fromDate: new Date(),
      toDate: undefined,
      description: '',
      experienceLatterUrl: ''
    }]);
  };

  const handleRemove = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Experience, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      {data.map((experience, index) => (
        <div key={index} className="relative bg-gray-50 p-4 rounded-lg">
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput 
              label='Institution'
              value={experience.institution}
              onChange={(value) => handleChange(index, 'institution', value)}
              required
            />
            <TextInput 
             label='Position'
             value={experience.position}
             onChange={(value) => handleChange(index, 'position', value)}
             required
            />
            <DateInput 
             label='From Date'
             value={experience.fromDate && !isNaN(new Date(experience.fromDate).getTime()) 
              ? new Date(experience.fromDate).toISOString().split('T')[0] 
              : ''}
             onChange={(value) => handleChange(index, 'fromDate', new Date(value))}
             required
            />
            <DateInput 
             label='To Date'
             value={experience.toDate ? new Date(experience.toDate).toISOString().split('T')[0] : ''}
             onChange={(value) => handleChange(index, 'toDate', new Date(value))}
             required
            />

            <div className="md:col-span-2">
              <TextArea 
               label='Description'
               value={experience.description || ''}
               onChange={(value) => handleChange(index, 'description', value)}
               rows={3}
              />
            </div>

            <DocumentUploader
              currentDocumentUrl={experience.experienceLatterUrl || ''}
              documentType="Experience Letter"
              onDocumentChange={(url) => handleChange(index, 'experienceLatterUrl', url)}
              folder={`teachers/experience/${index}`}
              label="Experience Letter"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Experience
      </button>
    </div>
  );
}
