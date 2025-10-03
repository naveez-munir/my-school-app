import { useNavigate } from 'react-router';
import { isAdmin } from '~/utils/auth';
import type { ReactNode } from 'react';

interface DetailField {
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
  valueClassName?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DetailSectionProps {
  title: string;
  editPath?: string;
  studentId?: string;
  fields: DetailField[];
  columns?: 2 | 3;
  className?: string;
  showEditButton?: boolean;
}

export function DetailSection({
  title,
  editPath,
  studentId,
  fields,
  columns = 3,
  className = '',
  showEditButton = true
}: DetailSectionProps) {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();

  const columnClass = columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className={`bg-white border border-gray-300 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showEditButton && editPath && isAdminUser && studentId && (
          <button
            onClick={() => navigate(`/dashboard/students/${studentId}${editPath}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span>✏️</span>
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        <div className={`grid gap-6 ${columnClass}`}>
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={index} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                  <span className="text-sm text-gray-600 font-medium">{field.label}</span>
                </div>
                <p className={`text-gray-900 font-medium ${field.valueClassName || ''}`}>
                  {field.value !== undefined && field.value !== null
                    ? field.value
                    : (field.fallback || 'Not provided')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

