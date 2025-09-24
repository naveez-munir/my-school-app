import { useState } from "react";
import type { StaffListResponse } from "~/types/staff";
import {
  useStaffList,
  useDeleteStaff
} from "~/hooks/useStaffQueries";
import { StaffSkeleton } from "./StaffSkeleton";
import { StaffTable } from "./StaffTable";
import toast from "react-hot-toast";
import DeletePrompt from "../common/DeletePrompt";
import { getErrorMessage } from "~/utils/error";
import { useNavigate } from "react-router";
import { Users, Plus } from "lucide-react";

export const StaffSection = () => {
  const navigate = useNavigate();
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

  const deleteStaffMutation = useDeleteStaff();

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

  const handleEdit = (staff: StaffListResponse) => {
    navigate(`/dashboard/staff/${staff.id}/edit`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">Staff Management</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage staff members and their information
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/staff/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
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
      </div>

      <DeletePrompt
        isOpen={deletePrompt.isOpen}
        onClose={closeDeletePrompt}
        onConfirm={confirmDelete}
        itemName={`staff member`}
      />
    </div>
  );
};
