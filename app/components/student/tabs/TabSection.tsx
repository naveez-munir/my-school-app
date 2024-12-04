import { useNavigate } from 'react-router';
import { isAdmin } from '~/utils/auth';

interface TabField {
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
  valueClassName?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabSectionProps {
  title: string;
  editPath?: string;
  studentId?: string;
  fields: TabField[];
  columns?: 2 | 3;
  className?: string;
  showEditButton?: boolean;
}

export function TabSection({
  title,
  editPath,
  studentId,
  fields,
  columns = 2,
  className = '',
  showEditButton = true
}: TabSectionProps) {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();

  const columnClass = columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className={`${className}`}>
      <h4 className="text-heading mb-3 sm:mb-4">{title}</h4>
      <div className={`grid gap-4 sm:gap-6 ${columnClass}`}>
        {fields.map((field, index) => {
          const Icon = field.icon;
          return (
            <div key={index} className="flex flex-col">
              <div className="flex-center mb-2">
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
  );
}

