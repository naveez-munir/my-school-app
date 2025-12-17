import { FieldCard } from '~/components/common/ui/FieldCard';
import type { InfoCardProps } from '~/types/student';

export function InfoCard({
  title,
  editPath,
  studentId,
  fields,
  className = '',
  showEditButton = true
}: InfoCardProps) {
  const fullEditPath = editPath && studentId
    ? `/dashboard/students/${studentId}${editPath}`
    : undefined;

  return (
    <FieldCard
      title={title}
      fields={fields}
      layout="single-column"
      editPath={fullEditPath}
      resourceId={studentId}
      className={className}
      showEditButton={showEditButton}
      variant="default"
    />
  );
}
