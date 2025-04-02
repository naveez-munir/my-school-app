import { Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { type Experience } from '~/types/staff';

interface ExperienceItemProps {
  index: number;
  experience: Experience;
  allExperience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
  isSubmitting: boolean;
}

export function ExperienceItem({
  index,
  experience,
  allExperience,
  setExperience,
  isSubmitting
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
          label="Company"
          value={experience.company}
          onChange={(value) => handleChange('company', value)}
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
          label="Start Date"
          value={experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : ''}
          onChange={(value) => handleChange('startDate', new Date(value))}
          required
          disabled={isSubmitting}
        />
        
        <DateInput
          label="End Date"
          value={experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : ''}
          onChange={(value) => handleChange('endDate', new Date(value))}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-2">
        <TextInput
          label="Location"
          value={experience.location || ''}
          onChange={(value) => handleChange('location', value)}
          disabled={isSubmitting}
        />
      </div>

      <TextArea
        label="Description"
        value={experience.description || ''}
        onChange={(value) => handleChange('description', value)}
        rows={3}
        disabled={isSubmitting}
      />
    </div>
  );
}
