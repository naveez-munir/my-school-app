import { useMyLeaves } from '~/hooks/useStudentLeaveQueries';
import { LeaveBaseTable } from './LeaveBaseTable';
import type { SearchStudentLeaveRequest } from '~/types/studentLeave';

export function StudentLeavesTable({studentId}:{studentId? : string}) {
  const params: SearchStudentLeaveRequest = {};
  if (studentId) {
    params.studentId = studentId;
  }
  const { data = [], isLoading, error } = useMyLeaves(params);

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
