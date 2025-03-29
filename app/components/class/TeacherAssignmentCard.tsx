import { UserX, Phone, Mail, BookOpen } from 'lucide-react'
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
  const isMain = variant === 'main';
  const bgColor = isMain ? 'bg-blue-50' : 'bg-amber-50';
  const borderColor = isMain ? 'border-blue-200' : 'border-amber-200';
  const avatarBg = isMain ? 'bg-blue-200 text-blue-700' : 'bg-amber-200 text-amber-700';

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} overflow-hidden`}>
      <div className="p-4 flex items-start gap-4">
        {/* Teacher Avatar */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${avatarBg} text-lg font-bold shrink-0`}>
          {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
        </div>
        
        {/* Teacher Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="font-semibold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h3>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                disabled={isLoading}
                className={`text-sm ${isLoading ? 'opacity-50 cursor-wait' : ''} 
                  px-3 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 
                  flex items-center gap-1 self-start transition-colors`}
              >
                <UserX className="h-3.5 w-3.5" />
                {isLoading ? 'Removing...' : 'Remove'}
              </button>
            )}
          </div>
          
          {/* Contact Info & Qualifications */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {teacher.email && (
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                <span className="truncate">{teacher.email}</span>
              </div>
            )}
            {teacher.phone && (
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="h-3.5 w-3.5 mr-1.5" />
                <span>{teacher.phone}</span>
              </div>
            )}
          </div>
          
          {/* Subjects */}
          {teacher.subjects && teacher.subjects.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center text-sm text-gray-700 mb-1.5">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                <span className="font-medium">Subjects:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {teacher.subjects.map((subject, idx) => (
                  <span 
                    key={idx} 
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isMain ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
