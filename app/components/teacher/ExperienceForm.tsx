import { Plus, X } from 'lucide-react';
import type { Experience } from '~/types/teacher';

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
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution*</label>
              <input
                type="text"
                value={experience.institution}
                onChange={(e) => handleChange(index, 'institution', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position*</label>
              <input
                type="text"
                value={experience.position}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">From Date*</label>
              <input
                type="date"
                value={experience.fromDate ? new Date(experience.fromDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange(index, 'fromDate', new Date(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={experience.toDate ? new Date(experience.toDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange(index, 'toDate', new Date(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={experience.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Experience Letter URL</label>
              <input
                type="url"
                value={experience.experienceLatterUrl}
                onChange={(e) => handleChange(index, 'experienceLatterUrl', e.target.value)}
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
        Add Experience
      </button>
    </div>
  );
}
