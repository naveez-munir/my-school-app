import { UserX } from 'lucide-react'
import type { Teacher, TeacherResponse } from '~/types/teacher'

interface TeacherAssignmentCardProps {
  teacher: Teacher
  onRemove?: () => void
  isLoading?: boolean
  variant?: 'main' | 'temporary'
}

export function TeacherAssignmentCard({
  teacher,
  onRemove,
  isLoading = false,
  variant = 'main'
}: TeacherAssignmentCardProps) {
  const bgColor = variant === 'main' ? 'bg-blue-50' : 'bg-yellow-50'
  const textColor = variant === 'main' ? 'text-blue-900' : 'text-yellow-900'
  const subTextColor = variant === 'main' ? 'text-blue-700' : 'text-yellow-700'

  return (
    <div className={`flex items-center justify-between p-3 ${bgColor} rounded-md`}>
      <div>
        <p className={`font-medium ${textColor}`}>{teacher.firstName}</p>
        <p className={`text-sm ${subTextColor}`}>{teacher.email}</p>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={isLoading}
          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center gap-1"
        >
          <UserX className="h-4 w-4" />
          Remove
        </button>
      )}
    </div>
  )
}
