import { ClassSelector } from "~/components/common/ClassSelector";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { TextArea } from "~/components/common/form/inputs/TextArea";
import { DateInput } from "~/components/common/form/inputs/DateInput";


export interface BasicInfoFormProps {
  data: {
    classId: string;
    date: string;
    title: string;
    description: string;
  };
  onChange: (data: Partial<{
    classId: string;
    date: string;
    title: string;
    description: string;
  }>) => void;
}

export function BasicInfoForm({ data, onChange }: BasicInfoFormProps) {

  const handleClassChange = (classId: string) => {
    onChange({ classId });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClassSelector
          label="Class"
          value={data.classId}
          onChange={handleClassChange}
          required
        />
        
        <div>
          <DateInput 
           label="Date"
           required
           value={data.date}
           onChange={(value) => onChange({ date: value })}
           placeholder="Select a date"
          />
        </div>
      </div>

      <div>
        <TextInput 
         label="Title"
         required
         value={data.title}
         onChange={(value) => onChange({ title: value })}
         placeholder="e.g., Math Review Session"
        />
      </div>

      <div>
        <TextArea 
         label="Description"
         required
         value={data.description}
         onChange={(value) => onChange({ description: value })}
         placeholder="Describe the day's activities and important notes..."
         rows={4}
        />
      </div>
    </div>
  );
}
