import { useNavigate } from 'react-router';
import { isAdmin } from '~/utils/auth';

interface SectionField {
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
  valueClassName?: string;
}

interface SectionCardProps {
  title: string;
  editPath?: string;
  studentId?: string;
  fields: SectionField[];
  className?: string;
  showEditButton?: boolean;
}

export function SectionCard({
  title,
  editPath,
  studentId,
  fields,
  className = '',
  showEditButton = true
}: SectionCardProps) {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();

  // Split fields into two columns
  const midpoint = Math.ceil(fields.length / 2);
  const leftColumn = fields.slice(0, midpoint);
  const rightColumn = fields.slice(midpoint);

  return (
    <div className={`border border-gray-300 rounded-lg bg-white ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 text-base">{title}</h4>
        {showEditButton && editPath && isAdminUser && studentId && (
          <button
            onClick={() => navigate(`/dashboard/students/${studentId}${editPath}`)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {/* Content - Two Column Layout */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumn.map((field, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-gray-600 text-sm font-medium">{field.label}:</span>
                <p className={`text-gray-900 text-sm mt-1 ${field.valueClassName || ''}`}>
                  {field.value !== undefined && field.value !== null
                    ? field.value
                    : (field.fallback || 'Not provided')}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightColumn.map((field, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-gray-600 text-sm font-medium">{field.label}:</span>
                <p className={`text-gray-900 text-sm mt-1 ${field.valueClassName || ''}`}>
                  {field.value !== undefined && field.value !== null
                    ? field.value
                    : (field.fallback || 'Not provided')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

