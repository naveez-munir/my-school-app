import { ChevronDown, ChevronUp } from 'lucide-react';
import type { TableMetaType } from './GenericDataTable';

export function SortableColumnHeader({ 
  column, 
  title 
}: { 
  column: any, 
  title: string 
}) {
  return (
    <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
      <span>{title}</span>
      {column.getIsSorted() === 'asc' ? (
        <ChevronUp className="ml-1 h-4 w-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <ChevronDown className="ml-1 h-4 w-4" />
      ) : null}
    </div>
  );
}

export interface ActionButton<T> {
  label: string;
  onClick: (item: T, id: string, meta: TableMetaType<T>) => void;
  color: 'blue' | 'red' | 'green' | 'gray';
}

export function createActionsColumn<T>(actions: ActionButton<T>[]) {
  return {
    header: () => <div className="text-right">Actions</div>,
    cell: (info: any) => {
      const meta = info.table.options.meta as TableMetaType<T>;
      const item = info.row.original;
      const id = info.getValue();
      
      return (
        <div className="flex justify-end space-x-4">
          {actions.map((action, index) => {
            const colorClass = 
              action.color === 'blue' ? 'text-blue-600 hover:text-blue-900' :
              action.color === 'red' ? 'text-red-600 hover:text-red-900' :
              action.color === 'green' ? 'text-green-600 hover:text-green-900' :
              'text-gray-600 hover:text-gray-900';
              
            return (
              <button
                key={index}
                onClick={() => action.onClick(item, id, meta)}
                className={`${colorClass} cursor-pointer`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      );
    },
  };
}
