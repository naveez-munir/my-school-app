import { useState } from "react";
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
  useCreateLeave, 
  useUpdateLeave, 
  useCancelLeave,
  useApproveLeave
} from "~/hooks/staffLeaveQueries";
import { EmployeeTypeSelector } from "~/components/common/EmployeeTypeSelector";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { DateInput } from "~/components/common/form/inputs/DateInput";

export const LeaveSection = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState<LeaveResponse | null>(null);
  const [filters, setFilters] = useState<SearchLeaveRequest>({});

  const { 
    data: leaves = [], 
    isLoading, 
    error 
  } = useLeaves(filters);
  
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
      } else {
        await createLeaveMutation.mutateAsync(data);
      }
      setIsFormModalOpen(false);
      setSelectedLeave(null);
    } catch (err) {
      console.error("Error saving leave request:", err);
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
      } catch (err) {
        console.error("Error cancelling leave:", err);
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
      setIsApproveModalOpen(false);
    } catch (err) {
      console.error("Error processing leave request:", err);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Leave Management
        </h2>
        <button
          onClick={() => {
            setSelectedLeave(null);
            setIsFormModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Leave Request
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EmployeeTypeSelector
            value={filters?.employeeType || undefined}
            onChange={(value) => handleFilterChange('employeeType', value)}
            label="Filter by Employee Type"
          />
          {/* TODO need to add the support to filter ALL types like by default it should be All types */}
          <SelectInput<typeof LeaveType>
            label="Filter by Leave Type"
            value={filters.leaveType}
            options={LeaveType}
            onChange={(value) => handleFilterChange('leaveType', value || undefined)}
          />
          {/* TODO need to add the support to filter ALL for this as well */}
          <SelectInput<typeof LeaveStatus>
            label="Filter by Status"
            value={filters.status}
            options={LeaveStatus}
            onChange={(value) => handleFilterChange('status', value || undefined)}
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
    </div>
  );
};
