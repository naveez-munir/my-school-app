import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Route } from "../+types";
import { useFeeStructure, useUpdateFeeStructure } from '~/hooks/useFeeStructureQueries';
import { FeeStructureForm } from '~/components/Fee/feeStructure/FeeStructureForm';
import type { CreateFeeStructureInput, FeeStructure, PopulatedFeeStructure } from '~/types/studentFee';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit Fee Structure" },
    { name: "description", content: "Edit fee structure details" },
  ];
}

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

export default function EditFeeStructure() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: structure, isLoading, error } = useFeeStructure(id || '');
  const updateStructureMutation = useUpdateFeeStructure();

  const handleUpdate = async (data: CreateFeeStructureInput) => {
    if (!id) return;
    
    try {
      await updateStructureMutation.mutateAsync({
        id,
        data
      });
      toast.success("Fee structure updated successfully!");
      navigate('/dashboard/fee/structure');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update fee structure";
      toast.error(errorMessage);
      console.error("Error updating fee structure:", err);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/fee/structure');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !structure) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {(error as Error)?.message || "Fee structure not found"}
        </div>
      </div>
    );
  }

  const baseStructure = getBaseStructure(structure);

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fee Structures
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Fee Structure</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <FeeStructureForm
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          initialData={baseStructure}
          academicYear={baseStructure.academicYear}
          isSubmitting={updateStructureMutation.isPending}
          mode="edit"
        />
      </div>
    </div>
  );
}

