import { useNavigate } from 'react-router';
import { isAdmin } from '~/utils/auth';

interface InfoCardProps {
  title: string;
  editPath?: string;
  studentId?: string;
  fields: {
    label: string;
    value: string | number | null | undefined;
    fallback?: string;
    valueClassName?: string;
  }[];
  className?: string;
  showEditButton?: boolean;
}

export function InfoCard({ 
  title, 
  editPath, 
  studentId, 
  fields, 
  className = '',
  showEditButton = true
}: InfoCardProps) {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();

  return (
    <div className={`border rounded-lg p-5 space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-700">{title}</h4>
        {showEditButton && editPath && isAdminUser && studentId && (
          <button 
            onClick={() => navigate(`/dashboard/students/${studentId}${editPath}`)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={index}>
            <span className="text-gray-500 text-sm">{field.label}:</span>
            <p className={field.valueClassName || ''}>
              {field.value !== undefined && field.value !== null 
                ? field.value 
                : (field.fallback || 'Not provided')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
