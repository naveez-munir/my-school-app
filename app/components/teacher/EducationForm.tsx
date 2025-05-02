import { Plus, X } from 'lucide-react';
import type { EducationHistory } from '~/types/teacher';
import { TextInput } from '../common/form/inputs/TextInput';
import { DocumentUploader } from '../student/form/DocumentUploader';

interface EducationFormProps {
  data: EducationHistory[];
  qualification: string[];
  onUpdate: (value: EducationHistory[]) => void;
}

export function EducationForm({ data = [], qualification = [], onUpdate }: EducationFormProps) {
  const handleAdd = () => {
    onUpdate([...data, {
      degree: '',
      institution: '',
      year: new Date().getFullYear(),
      certificateUrl: ''
    }]);
  };

  const handleRemove = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof EducationHistory, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      {qualification.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Teacher Qualifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {qualification.map((item, index) => (
              <div key={index} className="bg-white px-3 py-1.5 rounded-full text-sm font-medium text-blue-700 border border-blue-200 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.map((education, index) => (
        <div key={index} className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextInput 
              label='Degree'
              value={education.degree}
              onChange={(value) => handleChange(index, 'degree', value)}
              required
            />
            <TextInput 
              label='Institution'
              value={education.institution}
              onChange={(value) => handleChange(index, 'institution', value)}
              required
            />

            <TextInput 
              label='Year'
              value={education.year.toString()}
              onChange={(value) => handleChange(index, 'year', parseInt(value))}
              type='number'
              required
            />
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <DocumentUploader
              currentDocumentUrl={education.certificateUrl || ''}
              documentType="Degree Certificate"
              onDocumentChange={(url) => handleChange(index, 'certificateUrl', url)}
              folder={`teachers/education/${index}`}
              label="Certificate"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Education
      </button>
    </div>
  );
}
