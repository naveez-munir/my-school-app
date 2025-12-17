import { FieldCard } from '~/components/common/ui/FieldCard';
import type { TabSectionProps } from '~/types/student';

/**
 * @deprecated Use FieldCard directly with layout="grid-2" or "grid-3"
 * This component is kept for backward compatibility
 */
export function TabSection({
  title,
  editPath,
  studentId,
  fields,
  columns = 2,
  className = '',
  showEditButton = true
}: TabSectionProps) {
  const fullEditPath = editPath && studentId
    ? `/dashboard/students/${studentId}${editPath}`
    : undefined;

  const layout = columns === 2 ? 'grid-2' : 'grid-3';

  return (
    <div className={className}>
      <h4 className="text-heading mb-3 sm:mb-4">{title}</h4>
      <div className={layout === 'grid-2' ? 'grid gap-4 sm:gap-6 grid-cols-2' : 'grid gap-4 sm:gap-6 grid-cols-3'}>
        {fields.map((field, index) => {
          const Icon = field.icon;
          return (
            <div key={index} className="flex flex-col">
              <div className={`${Icon ? 'flex-center' : ''} mb-2`}>
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

