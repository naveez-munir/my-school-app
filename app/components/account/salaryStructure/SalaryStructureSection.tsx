import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import type { SalaryStructureResponse } from "~/types/salaryStructure";
import {
  useSalaryStructures,
  useDeleteSalaryStructure,
  useActivateSalaryStructure,
  useDeactivateSalaryStructure
} from "~/hooks/useSalaryStructure";
import { SalaryStructuresSkeleton } from "./SalaryStructuresSkeleton";
import { SalaryStructuresTable } from "./SalaryStructuresTable";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

const getErrorMessage = (err: any): string => {
  return err?.response?.data?.message || err?.message || "An error occurred";
};

export const SalaryStructureSection = () => {
  const navigate = useNavigate();
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string | null; employeeName?: string }>({
    isOpen: false,
    id: null,
    employeeName: undefined
  });

  // React Query hooks
  const {
    data: structures = [],
    isLoading,
    error
  } = useSalaryStructures({
    employeeType: selectedEmployeeType !== 'all' ? selectedEmployeeType as any : undefined,
    isActive: selectedStatus !== 'all' ? selectedStatus : undefined
  });

  const deleteStructureMutation = useDeleteSalaryStructure();
  const activateMutation = useActivateSalaryStructure();
  const deactivateMutation = useDeactivateSalaryStructure();

  const handleDelete = (id: string) => {
    const structure = structures.find(s => s.id === id);
    setDeleteConfirmation({
      isOpen: true,
      id,
      employeeName: structure?.employeeName
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.id) {
      try {
        const result = await deleteStructureMutation.mutateAsync(deleteConfirmation.id);
        if (result?.reactivatedPrevious) {
          toast.success("Salary structure deleted. Previous structure reactivated.");
        } else {
          toast.success("Salary structure deleted successfully");
        }
        setDeleteConfirmation({ isOpen: false, id: null, employeeName: undefined });
      } catch (err) {
        console.error("Error deleting salary structure:", err);
        toast.error(getErrorMessage(err));
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const structure = structures.find(s => s.id === id);
      if (structure) {
        if (structure.isActive) {
          await deactivateMutation.mutateAsync(id);
          toast.success("Salary structure deactivated successfully");
        } else {
          await activateMutation.mutateAsync(id);
          toast.success("Salary structure activated successfully");
        }
      }
    } catch (err) {
      console.error("Error toggling salary structure status:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const handleEdit = (structure: SalaryStructureResponse) => {
    navigate(`/dashboard/accounts/salary-structure/${structure.id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xs sm:text-sm font-semibold text-gray-700">
          Salary Structure Management
        </h2>
        <button
          onClick={() => navigate('/dashboard/accounts/salary-structure/new')}
          className="bg-blue-600 text-white text-xs sm:text-sm  px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Salary Structure
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Filter by Employee Type
            </label>
            <select
              value={selectedEmployeeType}
              onChange={(e) => setSelectedEmployeeType(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-xs sm:text-sm text-gray-700"
            >
              <option value="all">All Employee Types</option>
              <option value="Teacher">Teachers</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-xs sm:text-sm text-gray-700"
            >
              <option value="all">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <SalaryStructuresSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : (
        <SalaryStructuresTable
          data={structures}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, id: null, employeeName: undefined })}
        onConfirm={confirmDelete}
        employeeName={deleteConfirmation.employeeName}
        isDeleting={deleteStructureMutation.isPending}
      />
    </div>
  );
};
