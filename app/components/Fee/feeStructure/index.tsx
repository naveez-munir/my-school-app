import { useState } from "react";

import type { FeeStructure, PopulatedFeeStructure, CreateFeeStructureInput, CloneFeeStructureInput } from "~/types/studentFee";
import { 
  useFeeStructures, 
  useCreateFeeStructure, 
  useUpdateFeeStructure, 
  useDeleteFeeStructure,
  useToggleFeeStructureStatus,
  useCloneFeeStructure
} from "~/hooks/useFeeStructureQueries";
import { FeeStructuresSkeleton } from "./FeeStructuresSkeleton";
import { FeeStructuresTable } from "./FeeStructuresTable";
import { FeeStructureModal } from "./FeeStructureModal";
import { CloneFeeStructureModal } from "./CloneFeeStructureModal";
import { getCurrentAcademicYear } from "~/utils/academicYearUtils";
import { AcademicYearSelector } from "~/components/common/AcademicYearSelector";


const getBaseStructure = (structure: FeeStructure | PopulatedFeeStructure): FeeStructure => {

  const { feeComponents, ...rest } = structure;

  const extractedComponents = feeComponents.map(comp => {
    if (typeof comp.feeCategory === 'object') {
      return {
        ...comp,
        feeCategory: comp.feeCategory._id
      };
    }
    return comp;
  });
  
  return {
    ...rest,
    feeComponents: extractedComponents
  } as FeeStructure;
};

export const FeeStructureSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const [cloningStructure, setCloningStructure] = useState<FeeStructure | null>(null);
  const [academicYear, setAcademicYear] = useState<string>(getCurrentAcademicYear());

  // React Query hooks
  const { 
    data: structures = [], 
    isLoading, 
    error 
  } = useFeeStructures({ academicYear, includeComponents: true, includeClass: true });
  
  const createStructureMutation = useCreateFeeStructure();
  const updateStructureMutation = useUpdateFeeStructure();
  const deleteStructureMutation = useDeleteFeeStructure();
  const toggleStatusMutation = useToggleFeeStructureStatus();
  const cloneStructureMutation = useCloneFeeStructure();

  const handleCreate = async (data: CreateFeeStructureInput) => {
    try {
      await createStructureMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating fee structure:", err);
    }
  };

  const handleUpdate = async (data: CreateFeeStructureInput) => {
    if (editingStructure) {
      try {
        await updateStructureMutation.mutateAsync({ 
          id: editingStructure._id, 
          data 
        });
        setIsModalOpen(false);
        setEditingStructure(null);
      } catch (err) {
        console.error("Error updating fee structure:", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await deleteStructureMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting fee structure:", err);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatusMutation.mutateAsync(id);
    } catch (err) {
      console.error("Error toggling fee structure status:", err);
    }
  };

  const handleClone = async (data: CloneFeeStructureInput) => {
    if (cloningStructure) {
      try {
        await cloneStructureMutation.mutateAsync({ 
          id: cloningStructure._id, 
          data 
        });
        setIsCloneModalOpen(false);
        setCloningStructure(null);
      } catch (err) {
        console.error("Error cloning fee structure:", err);
      }
    }
  };

  const handleEdit = (structure: FeeStructure | PopulatedFeeStructure) => {
    setEditingStructure(getBaseStructure(structure));
    setIsModalOpen(true);
  };

  const handleCloneStart = (structure: FeeStructure | PopulatedFeeStructure) => {
    setCloningStructure(getBaseStructure(structure));
    setIsCloneModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Fee Structure Management
        </h2>
        <button
          onClick={() => {
            setEditingStructure(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Fee Structure
        </button>
      </div>

      <AcademicYearSelector 
        value={academicYear}
        onChange={setAcademicYear}
      />

      {isLoading ? (
        <FeeStructuresSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : (
        <FeeStructuresTable
          data={structures}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onClone={handleCloneStart}
        />
      )}

      <FeeStructureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStructure(null);
        }}
        onSubmit={editingStructure ? handleUpdate : handleCreate}
        initialData={editingStructure || undefined}
        academicYear={academicYear}
        isSubmitting={createStructureMutation.isPending || updateStructureMutation.isPending}
      />

      <CloneFeeStructureModal
        isOpen={isCloneModalOpen}
        onClose={() => {
          setIsCloneModalOpen(false);
          setCloningStructure(null);
        }}
        onSubmit={handleClone}
        sourceStructure={cloningStructure}
        isSubmitting={cloneStructureMutation.isPending}
      />
    </div>
  );
};
