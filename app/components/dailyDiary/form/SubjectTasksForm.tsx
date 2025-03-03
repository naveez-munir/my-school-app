import { SubjectSelector } from "~/components/common/SubjectSelector";
import { Plus, Trash2 } from "lucide-react";
import type { SubjectTaskRequest } from "~/types/dailyDiary";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { DateInput } from "~/components/common/form/inputs/DateInput";

interface SubjectTasksFormProps {
  tasks: SubjectTaskRequest[];
  onChange: (tasks: SubjectTaskRequest[]) => void;
}

export function SubjectTasksForm({ tasks, onChange }: SubjectTasksFormProps) {
  const addSubjectTask = () => {
    onChange([
      ...tasks,
      { subject: '', task: '', additionalNotes: '' }
    ]);
  };

  const updateSubjectTask = (index: number, field: keyof SubjectTaskRequest, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    onChange(updatedTasks);
  };

  const removeSubjectTask = (index: number) => {
    onChange(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-4 border-t">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Subject Tasks</h2>
        <button
          type="button"
          onClick={addSubjectTask}
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 text-sm hover:bg-blue-100"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </button>
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
          No subject tasks added yet.
        </div>
      )}
      
      {tasks.map((task, index) => (
        <SubjectTaskItem 
          key={index}
          task={task}
          index={index}
          onUpdate={updateSubjectTask}
          onRemove={removeSubjectTask}
        />
      ))}
    </div>
  );
}

interface SubjectTaskItemProps {
  task: SubjectTaskRequest;
  index: number;
  onUpdate: (index: number, field: keyof SubjectTaskRequest, value: any) => void;
  onRemove: (index: number) => void;
}

function SubjectTaskItem({ task, index, onUpdate, onRemove }: SubjectTaskItemProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-700">Task #{index + 1}</h3>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <SubjectSelector
          value={task.subject}
          onChange={(value) => onUpdate(index, 'subject', value)}
          required
        />
        <TextInput 
         label={'Task'}
         value={task.task}
         onChange={(value) => onUpdate(index, 'task', value)}
         placeholder="e.g., Homework, Assignment, Reading"
         required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <DateInput 
         label="Due Date"
         value={task.dueDate || ''}
         onChange={(value) => onUpdate(index, 'dueDate', value)}
        />
        <TextInput 
         label="Additional Notes"
         value={task.additionalNotes || ''}
         onChange={(value) => onUpdate(index, 'additionalNotes', value)}
         placeholder="Any additional information..."
        />
      </div>
    </div>
  );
}
