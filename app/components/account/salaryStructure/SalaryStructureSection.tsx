import { useState } from "react";
import type { SalaryStructureResponse, CreateSalaryStructureDto, BaseSalaryStructure } from "~/types/salaryStructure";
import { 
  useSalaryStructures, 
  useCreateSalaryStructure, 
  useUpdateSalaryStructure, 
  useDeleteSalaryStructure,
  useActivateSalaryStructure,
  useDeactivateSalaryStructure
} from "~/hooks/useSalaryStructure";
import { SalaryStructuresSkeleton } from "./SalaryStructuresSkeleton";
import { SalaryStructuresTable } from "./SalaryStructuresTable";
import { SalaryStructureModal } from "./SalaryStructureModal";

const getBaseStructure = (structure: SalaryStructureResponse): BaseSalaryStructure => {
  const { id, employeeName, employee, createdAt, updatedAt, ...rest } = structure;
  
  return {
    id,
    ...rest
  } as BaseSalaryStructure;
};

export const SalaryStructureSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<BaseSalaryStructure | null>(null);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<string>('all');

  // React Query hooks
  const { 
    data: structures = [], 
    isLoading, 
    error 
  } = useSalaryStructures({ 
    employeeType: selectedEmployeeType !== 'all' ? selectedEmployeeType as any : undefined
  });
  
  const createStructureMutation = useCreateSalaryStructure();
  const updateStructureMutation = useUpdateSalaryStructure();
  const deleteStructureMutation = useDeleteSalaryStructure();
  const activateMutation = useActivateSalaryStructure();
  const deactivateMutation = useDeactivateSalaryStructure();

  const handleCreate = async (data: CreateSalaryStructureDto) => {
    try {
      await createStructureMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating salary structure:", err);
    }
  };

  const handleUpdate = async (data: CreateSalaryStructureDto) => {
    if (editingStructure) {
      try {
        await updateStructureMutation.mutateAsync({ 
          id: editingStructure.id as string, 
          data 
        });
        setIsModalOpen(false);
        setEditingStructure(null);
      } catch (err) {
        console.error("Error updating salary structure:", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this salary structure?')) {
      try {
        await deleteStructureMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting salary structure:", err);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      // Find the structure to determine if it's active or inactive
      const structure = structures.find(s => s.id === id);
      if (structure) {
        if (structure.isActive) {
          await deactivateMutation.mutateAsync(id);
        } else {
          await activateMutation.mutateAsync(id);
        }
      }
    } catch (err) {
      console.error("Error toggling salary structure status:", err);
    }
  };

  const handleEdit = (structure: SalaryStructureResponse) => {
    setEditingStructure(getBaseStructure(structure));
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Salary Structure Management
        </h2>
        <button
          onClick={() => {
            setEditingStructure(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Salary Structure
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Employee Type
            </label>
            <select
              value={selectedEmployeeType}
              onChange={(e) => setSelectedEmployeeType(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value="all">All Employee Types</option>
              <option value="Teacher">Teachers</option>
              <option value="Staff">Staff</option>
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

      <SalaryStructureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStructure(null);
        }}
        onSubmit={editingStructure ? handleUpdate : handleCreate}
        initialData={editingStructure || undefined}
        isSubmitting={createStructureMutation.isPending || updateStructureMutation.isPending}
      />
    </div>
  );
};
