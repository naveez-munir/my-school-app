import { useState } from 'react';
import { useMyClassStudentsLeaves } from '~/hooks/useStudentLeaveQueries';
import { LeaveBaseTable } from './LeaveBaseTable';
import { ApproveLeaveModal } from './ApproveLeaveModal';
import { ViewLeaveModal } from './ViewLeaveModal';
import { LeaveStatus, type StudentLeaveResponse } from '~/types/studentLeave';
import { Eye, CheckCircle } from 'lucide-react';

export function MyStudentsLeavesTable() {
  const [selectedLeaveForApproval, setSelectedLeaveForApproval] = useState<StudentLeaveResponse | null>(null);
  const [selectedLeaveForView, setSelectedLeaveForView] = useState<StudentLeaveResponse | null>(null);
  const { data = [], isLoading, error } = useMyClassStudentsLeaves();

  return (
    <>
      <LeaveBaseTable
        data={data}
        isLoading={isLoading}
        error={error}
        title="My Class Leave Requests"
        config={{
          showStudent: true,
          showReason: true,
          actions: (row) => (
            <div className="flex gap-2 justify-end">
              <button
                className="text-blue-600 hover:text-blue-900"
                onClick={() => setSelectedLeaveForView(row)}
                title="View Details"
              >
                <Eye className="h-5 w-5" />
              </button>

              {row.status === LeaveStatus.PENDING && (
                <button
                  className="text-green-600 hover:text-green-900"
                  onClick={() => setSelectedLeaveForApproval(row)}
                  title="Review Leave"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          )
        }}
      />

      {selectedLeaveForView && (
        <ViewLeaveModal
          leave={selectedLeaveForView}
          isOpen={!!selectedLeaveForView}
          onClose={() => setSelectedLeaveForView(null)}
        />
      )}

      {selectedLeaveForApproval && (
        <ApproveLeaveModal
          leave={selectedLeaveForApproval}
          isOpen={!!selectedLeaveForApproval}
          onClose={() => setSelectedLeaveForApproval(null)}
        />
      )}
    </>
  );
}
