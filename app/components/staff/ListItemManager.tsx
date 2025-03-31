import { Plus, Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';

interface ListItemManagerProps {
  title: string;
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  labelText: string;
  isSubmitting: boolean;
  emptyText: string;
}

export function ListItemManager({
  title,
  items,
  onAdd,
  onUpdate,
  onRemove,
  labelText,
  isSubmitting,
  emptyText
}: ListItemManagerProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{title}</label>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center text-blue-600 text-sm"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-sm text-gray-500 italic">{emptyText}</div>
      ) : (
        items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <TextInput
              value={item}
              onChange={(value) => onUpdate(index, value)}
              disabled={isSubmitting}
              label={labelText}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-600"
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
