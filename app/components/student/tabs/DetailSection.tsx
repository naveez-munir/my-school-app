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

  const columnClass = columns === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className="flex-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h3 className="text-heading lg:text-base font-semibold text-gray-900">{title}</h3>
        {showEditButton && editPath && isAdminUser && studentId && (
          <button
            onClick={() => navigate(`/dashboard/students/${studentId}${editPath}`)}
            className="btn-primary flex items-center gap-1 sm:gap-2"
          >
            <span>✏️</span>
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
        <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${columnClass}`}>
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={index} className="flex flex-col">
                <div className="flex-center mb-1 sm:mb-2">
                  {Icon && <Icon className="icon-md text-gray-500" />}
                  <span className="text-label">{field.label}</span>
                </div>
                <p className={`text-body font-medium ${field.valueClassName || ''}`}>
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

