import { Plus, X } from 'lucide-react';
import type { EducationHistory } from '~/types/teacher';
import { TextInput } from '../common/form/inputs/TextInput';

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
      <div>
        {qualification.map((item, index)=>(
          <div key={index}>
            <h3>{item}</h3>
          </div>
        ))}
      </div>
      {data.map((education, index) => (
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
             label='Degree'
             value={education.degree}
             onChange={(value) => handleChange(index, 'degree',value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Certificate URL</label>
              <input
                type="url"
                value={education.certificateUrl}
                onChange={(e) => handleChange(index, 'certificateUrl', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Education
      </button>
    </div>
  );
}
