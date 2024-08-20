import { useState, useMemo } from "react";
import toast from 'react-hot-toast';
import { LeavesTable } from './LeavesTable';
import { LeaveFormModal } from './LeaveFormModal';
import { LeaveDetailModal } from './LeaveDetailModal';
import { ApproveLeaveModal } from './ApproveLeaveModal';
import {
  type LeaveResponse,
  LeaveStatus,
  LeaveType,
  type SearchLeaveRequest,
  type CreateLeaveRequest,
  type ApproveLeaveRequest
} from "~/types/staffLeave";

import {
  useLeaves,
  useMyLeaves,
  useCreateLeave,
  useUpdateLeave,
  useCancelLeave,
  useApproveLeave
} from "~/hooks/staffLeaveQueries";
import { EmployeeTypeSelector } from "~/components/common/EmployeeTypeSelector";
import { LeaveTypeSelector } from "~/components/common/LeaveTypeSelector";
import { LeaveStatusSelector } from "~/components/common/LeaveStatusSelector";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { isAdmin, getUserRole } from "~/utils/auth";
import { UserRoleEnum } from "~/types/user";
import { useTeacherProfile } from "~/hooks/useTeacherQueries";
import { MyStudentsLeavesTable } from "~/components/leave/student/myStudentLeaves";

export const LeaveSection = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState<LeaveResponse | null>(null);
  const [filters, setFilters] = useState<SearchLeaveRequest>({});

  const isAdminUser = useMemo(() => isAdmin(), []);

  const userRole = getUserRole();
  const isTeacherRole = userRole?.role === UserRoleEnum.TEACHER;
  const { data: currentTeacher } = useTeacherProfile(isTeacherRole);
  const isClassTeacher = !isAdminUser && !!currentTeacher?.classTeacherOf;

  const {
    data: allLeaves = [],
    isLoading: isLoadingAll,
    error: errorAll
  } = useLeaves(filters, { enabled: isAdminUser });

  const {
    data: myLeaves = [],
    isLoading: isLoadingMy,
    error: errorMy
  } = useMyLeaves({ enabled: !isAdminUser });

  const leaves = isAdminUser ? allLeaves : myLeaves;
  const isLoading = isAdminUser ? isLoadingAll : isLoadingMy;
  const error = isAdminUser ? errorAll : errorMy;
  
  const createLeaveMutation = useCreateLeave();
  const updateLeaveMutation = useUpdateLeave();
  const cancelLeaveMutation = useCancelLeave();
  const approveLeaveMutation = useApproveLeave();

  // Create or update leave handler
  const handleSaveLeave = async (data: CreateLeaveRequest) => {
    try {
      if (selectedLeave?.id) {
        await updateLeaveMutation.mutateAsync({
          id: selectedLeave.id,
          data
        });
        toast.success('Leave request updated successfully');
      } else {
        await createLeaveMutation.mutateAsync(data);
        toast.success('Leave request created successfully');
      }
      setIsFormModalOpen(false);
      setSelectedLeave(null);
    } catch (err: any) {
      console.error("Error saving leave request:", err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save leave request');
    }
  };

  // Handle viewing a leave
  const handleView = (leave: LeaveResponse) => {
    setSelectedLeave(leave);
    setIsDetailModalOpen(true);
  };

  // Handle editing a leave
  const handleEdit = (leave: LeaveResponse) => {
    setSelectedLeave(leave);
    setIsFormModalOpen(true);
  };

  // Handle cancelling a leave
  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        await cancelLeaveMutation.mutateAsync(id);
        toast.success('Leave request cancelled successfully');
      } catch (err: any) {
        console.error("Error cancelling leave:", err);
        toast.error(err?.response?.data?.message || err?.message || 'Failed to cancel leave request');
      }
    }
  };

  // Handle approving a leave
  const handleApprove = (leave: LeaveResponse) => {
    setSelectedLeave(leave);
    setIsApproveModalOpen(true);
  };

  // Handle rejecting a leave
  const handleReject = (leave: LeaveResponse) => {
    setSelectedLeave(leave);
    setIsApproveModalOpen(true);
  };

  // Submit approval or rejection
  const submitApproval = async (id: string, data: ApproveLeaveRequest) => {
    try {
      await approveLeaveMutation.mutateAsync({ id, data });
      const action = data.status === LeaveStatus.APPROVED ? 'approved' : 'rejected';
      toast.success(`Leave request ${action} successfully`);
      setIsApproveModalOpen(false);
    } catch (err: any) {
      console.error("Error processing leave request:", err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to process leave request');
    }
  };

  // Handler for filter changes
  const handleFilterChange = (field: keyof SearchLeaveRequest, value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      const newFilters = { ...filters };
      delete newFilters[field];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-responsive-xl font-semibold text-gray-700">
          {isAdminUser ? 'Staff Leave Management' : 'My Leave Requests'}
        </h2>
        <button
          onClick={() => {
            setSelectedLeave(null);
            setIsFormModalOpen(true);
          }}
          className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700"
        >
          Create Leave Request
        </button>
      </div>

      {isAdminUser && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EmployeeTypeSelector
              value={filters?.employeeType || undefined}
              onChange={(value) => handleFilterChange('employeeType', value)}
              label="Filter by Employee Type"
            />
            <LeaveTypeSelector
              value={filters.leaveType as any}
              onChange={(value) => handleFilterChange('leaveType', value === 'all' ? undefined : value)}
              label="Filter by Leave Type"
              placeholder="All Types"
              includeAll={true}
            />
            <LeaveStatusSelector
              value={filters.status as any}
              onChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              label="Filter by Status"
              placeholder="All Statuses"
              includeAll={true}
            />

            <div className="grid grid-cols-2 gap-4">
              <DateInput
               label="From Date"
               value={filters.startDateFrom || ''}
               onChange={(value) => handleFilterChange('startDateFrom', value)}
              />
              <DateInput
                label="To Date"
                value={filters.startDateTo || ''}
                onChange={(value) => handleFilterChange('startDateTo', value)}
              />
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Loading leave requests...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : (
        <LeavesTable
          data={leaves}
          onView={handleView}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onApprove={handleApprove}
          onReject={handleReject}
          isAdmin={isAdminUser}
        />
      )}

      <LeaveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedLeave(null);
        }}
        onSubmit={handleSaveLeave}
        initialData={selectedLeave || undefined}
        isSubmitting={createLeaveMutation.isPending || updateLeaveMutation.isPending}
      />

      <LeaveDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLeave(null);
        }}
        leave={selectedLeave}
      />

      <ApproveLeaveModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedLeave(null);
        }}
        leave={selectedLeave}
        onApprove={submitApproval}
        isSubmitting={approveLeaveMutation.isPending}
      />

      {isClassTeacher && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <MyStudentsLeavesTable />
        </div>
      )}
    </div>
  );
};
