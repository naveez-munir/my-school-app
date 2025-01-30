import { FieldCard } from '~/components/common/ui/FieldCard';
import type { DetailSectionProps } from '~/types/student';

export function DetailSection({
  title,
  editPath,
  studentId,
  fields,
  columns = 3,
  className = '',
  showEditButton = true
}: DetailSectionProps) {
  const fullEditPath = editPath && studentId
    ? `/dashboard/students/${studentId}${editPath}`
    : undefined;

  const layout = columns === 2 ? 'grid-2' : 'grid-3';

  return (
    <FieldCard
      title={title}
      fields={fields}
      layout={layout}
      editPath={fullEditPath}
      resourceId={studentId}
      className={className}
      showEditButton={showEditButton}
      variant="card"
    />
  );
}

