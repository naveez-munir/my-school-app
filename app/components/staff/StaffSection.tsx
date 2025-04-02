import { useState } from "react";
import type { StaffListResponse, CreateStaffRequest, UpdateStaffRequest, EmploymentStatus } from "~/types/staff";
import { 
  useStaffList, 
  useCreateStaff, 
  useUpdateStaff, 
  useDeleteStaff,
  useUpdateStaffStatus,
  useStaff
} from "~/hooks/useStaffQueries";
import { StaffSkeleton } from "./StaffSkeleton";
import { StaffTable } from "./StaffTable";
import { StaffModal } from "./StaffModal";
import { cleanStaffData } from "~/utils/cleanFormData";
import toast from "react-hot-toast";
import DeletePrompt from "../common/DeletePrompt";
import { getErrorMessage } from "~/utils/error";

export const StaffSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [deletePrompt, setDeletePrompt] = useState<{
    isOpen: boolean;
    staffId: string | null;
  }>({
    isOpen: false,
    staffId: null,
  });

  const { 
    data: staffMembers = [], 
    isLoading, 
    error 
  } = useStaffList();

  const {
    data: staffDetail
  } = useStaff(selectedStaffId || "");
  
  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();
  const updateStatusMutation = useUpdateStaffStatus();

  const handleCreate = async (data: CreateStaffRequest) => {
    try {
      const cleanedData = cleanStaffData(data);
      await createStaffMutation.mutateAsync(cleanedData as CreateStaffRequest);
      setIsModalOpen(false);
      toast.success("Staff member created successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
      console.error("Error creating staff member:", err);
    }
  };

  const handleUpdate = async (data: UpdateStaffRequest) => {
    if (selectedStaffId) {
      try {
        const cleanedData = cleanStaffData(data);
        await updateStaffMutation.mutateAsync({ 
          id: selectedStaffId, 
          data: cleanedData
        });
        setIsModalOpen(false);
        setSelectedStaffId(null);
        toast.success("Staff member updated successfully");
      } catch (err) {
        toast.error(getErrorMessage(err));
        console.error("Error updating staff member:", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletePrompt({
      isOpen: true,
      staffId: id,
    });
  };

  const confirmDelete = async () => {
    if (deletePrompt.staffId) {
      try {
        await deleteStaffMutation.mutateAsync(deletePrompt.staffId);
        closeDeletePrompt();
        toast.success("Staff member deleted successfully");
      } catch (err) {
        toast.error(getErrorMessage(err));
        console.error("Error deleting staff member:", err);
      }
    }
  };

  const closeDeletePrompt = () => {
    setDeletePrompt({
      isOpen: false,
      staffId: null,
    });
  };

  // const handleStatusChange = async (staffId: string, status: EmploymentStatus) => {
  //   try {
  //     await updateStatusMutation.mutateAsync({ staffId, status });
  //     toast.success(`Status updated to ${status}`);
  //   } catch (err) {
  //     toast.error(getErrorMessage(err));
  //     console.error("Error updating staff status:", err);
  //   }
  // };

  const handleEdit = (staff: StaffListResponse) => {
    setSelectedStaffId(staff.id);
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
            setSelectedStaffId(null);
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
        />
      )}

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaffId(null);
        }}
        onSubmit={(data) => {
          if (selectedStaffId) {
            handleUpdate(data as UpdateStaffRequest);
          } else {
            handleCreate(data as CreateStaffRequest);
          }
        }}
        initialData={staffDetail}
        isSubmitting={createStaffMutation.isPending || updateStaffMutation.isPending}
      />

      <DeletePrompt
        isOpen={deletePrompt.isOpen}
        onClose={closeDeletePrompt}
        onConfirm={confirmDelete}
        itemName={`staff member`}
      />
    </div>
  );
};
