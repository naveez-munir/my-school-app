import { format } from 'date-fns';
import { Book, Edit2, Trash2, User, Clock } from 'lucide-react';
import type { SubjectTaskResponse } from '~/types/dailyDiary';

interface SubjectTaskCardProps {
  task: SubjectTaskResponse;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubjectTaskCard({
  task,
  canEdit,
  canDelete,
  onEdit,
  onDelete
}: SubjectTaskCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <Book className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
          <h3 className="font-medium text-gray-900">
            {task.subject.subjectName}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <div className="text-sm text-gray-500">
              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </div>
          )}

          {canEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="Edit task"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}

          {canDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2">
        <p className="text-gray-700">{task.task}</p>
      </div>

      {task.additionalNotes && (
        <div className="mt-2 text-sm text-gray-600">
          <div className="font-medium">Additional Notes:</div>
          <p>{task.additionalNotes}</p>
        </div>
      )}

      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
        {task.addedBy && (
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>
              Added by: {task.addedBy.firstName} {task.addedBy.lastName}
            </span>
          </div>
        )}

        {task.addedAt && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {format(new Date(task.addedAt), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
