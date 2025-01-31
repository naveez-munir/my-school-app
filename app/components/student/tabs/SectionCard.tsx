import { FieldCard } from '~/components/common/ui/FieldCard';
import type { SectionCardProps } from '~/types/student';

export function SectionCard({
  title,
  editPath,
  studentId,
  fields,
  className = '',
  showEditButton = true
}: SectionCardProps) {
  const fullEditPath = editPath && studentId
    ? `/dashboard/students/${studentId}${editPath}`
    : undefined;

  return (
    <FieldCard
      title={title}
      fields={fields}
      layout="two-column"
      editPath={fullEditPath}
      resourceId={studentId}
      className={className}
      showEditButton={showEditButton}
      variant="bordered"
    />
  );
}

