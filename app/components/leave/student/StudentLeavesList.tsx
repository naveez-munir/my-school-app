import { useState } from 'react';
import { useMyLeaves } from '~/hooks/useStudentLeaveQueries';
import { LeaveBaseTable } from './LeaveBaseTable';
import { StudentLeaveFormModal } from './StudentLeaveFormModal';
import type { SearchStudentLeaveRequest } from '~/types/studentLeave';
import { Plus } from 'lucide-react';

export function StudentLeavesTable({studentId}:{studentId? : string}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const params: SearchStudentLeaveRequest = {};
  if (studentId) {
    params.studentId = studentId;
  }
  const { data = [], isLoading, error } = useMyLeaves(params);

  return (
    <>
      <LeaveBaseTable
        data={data}
        isLoading={isLoading}
        error={error}
        title="My Leave Requests"
        config={{
          showReason: true,
          showComments: true
        }}
        headerContent={
          studentId ? (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm lg:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Create Leave Request
            </button>
          ) : null
        }
      />

      {studentId && (
        <StudentLeaveFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          studentId={studentId}
        />
      )}
    </>
  );
}
/*
GIT_AUTHOR_DATE="2025-07-30T12:00:00" GIT_COMMITTER_DATE="2025-07-30T12:00:00" git commit --amend --no-edit --date="2025-07-30T12:00:00"
*/
