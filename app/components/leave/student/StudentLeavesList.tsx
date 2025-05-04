import { useMyLeaves } from '~/hooks/useStudentLeaveQueries';
import { LeaveBaseTable } from './LeaveBaseTable';

export function StudentLeavesTable() {
  const { data = [], isLoading, error } = useMyLeaves();

  return (
    <LeaveBaseTable
      data={data}
      isLoading={isLoading}
      error={error}
      title="My Leave Requests"
      config={{
        showReason: true,
        showComments: true
      }}
    />
  );
}
