import { useState } from "react";
import type { StaffListResponse, StaffDetailResponse, CreateStaffRequest, UpdateStaffRequest, EmploymentStatus } from "~/types/staff";
import { 
  useStaffList, 
  useCreateStaff, 
  useUpdateStaff, 
  useDeleteStaff,
  useUpdateStaffStatus
} from "~/hooks/useStaffQueries";
import { StaffSkeleton } from "./StaffSkeleton";
import { StaffTable } from "./StaffTable";
import { StaffModal } from "./StaffModal";

export const StaffSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffDetailResponse | null>(null);

  // React Query hooks
  const { 
    data: staffMembers = [], 
    isLoading, 
    error 
  } = useStaffList();
  
  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();
  const updateStatusMutation = useUpdateStaffStatus();

  const handleCreate = async (data: CreateStaffRequest) => {
    try {
      await createStaffMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating staff member:", err);
    }
  };

  const handleUpdate = async (data: UpdateStaffRequest) => {
    if (editingStaff) {
      try {
        await updateStaffMutation.mutateAsync({ 
          id: editingStaff.id, 
          data 
        });
        setIsModalOpen(false);
        setEditingStaff(null);
      } catch (err) {
        console.error("Error updating staff member:", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteStaffMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting staff member:", err);
      }
    }
  };

  const handleStatusChange = async (staffId: string, status: EmploymentStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ staffId, status });
    } catch (err) {
      console.error("Error updating staff status:", err);
    }
  };

  const handleEdit = (staff: StaffListResponse) => {
    // Fetch detailed staff information when editing
    setEditingStaff(staff as unknown as StaffDetailResponse); // This is a simplification, ideally you would fetch the full details
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Staff Management
        </h2>
        <button
          onClick={() => {
            setEditingStaff(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Staff Member
        </button>
      </div>

      {isLoading ? (
        <StaffSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : (
        <StaffTable
          data={staffMembers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        onSubmit={(data) => {
          if (editingStaff) {
            handleUpdate(data as UpdateStaffRequest);
          } else {
            handleCreate(data as CreateStaffRequest);
          }
        }}
        initialData={editingStaff || undefined}
        isSubmitting={createStaffMutation.isPending || updateStaffMutation.isPending}
      />
    </div>
  );
};
