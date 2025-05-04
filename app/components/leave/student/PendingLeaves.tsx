import React, { useState } from 'react';
import { usePendingLeaves } from '~/hooks/useStudentLeaveQueries';
import { type StudentLeaveResponse } from '~/types/studentLeave';
import { LeaveBaseTable } from './LeaveBaseTable';
import { ApproveLeaveModal } from './ApproveLeaveModal';

export function PendingLeavesTable() {
  const [selectedLeave, setSelectedLeave] = useState<StudentLeaveResponse | null>(null);
  const { data = [], isLoading, error } = usePendingLeaves();

  return (
    <>
      <LeaveBaseTable
        data={data}
        isLoading={isLoading}
        error={error}
        title="Pending Leave Requests"
        emptyStateMessage="No pending leave requests found."
        searchPlaceholder="Search pending requests..."
        config={{
          showStudent: true,
          showReason: true,
          showCreatedAt: true,
          actions: (row) => (
            <button 
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => setSelectedLeave(row)}
            >
              Review
            </button>
          )
        }}
      />
      
      {selectedLeave && (
        <ApproveLeaveModal
          leave={selectedLeave}
          isOpen={!!selectedLeave}
          onClose={() => setSelectedLeave(null)}
        />
      )}
    </>
  );
}
