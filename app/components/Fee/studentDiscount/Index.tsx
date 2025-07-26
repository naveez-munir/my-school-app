import { useState } from "react";
import { 
  useStudentDiscountsByStudent, 
  useCreateStudentDiscount,
  useUpdateStudentDiscount,
  useToggleDiscountStatus,
  useRemoveStudentDiscount,
  useSyncDiscountWithFees
} from "~/hooks/useStudentDiscountQueries";
import type { StudentDiscount, CreateStudentDiscountInput, UpdateStudentDiscountInput } from "~/types/studentFee";
import { useStudents } from "~/hooks/useStudentQueries";
import { StudentSelector } from "~/components/common/StudentSelector";
import { StudentDiscountTable } from "./StudentDiscountTable";
import { CreateDiscountModal } from "./CreateDiscountModal";
import { EditDiscountModal } from "./EditDiscountModal";
import { ClassSelector } from "~/components/common/ClassSelector";

export const StudentDiscountSection = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<StudentDiscount | null>(null);

  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { 
    data: discounts = [], 
    isLoading: discountsLoading,
    error 
  } = useStudentDiscountsByStudent(selectedStudentId);

  const createDiscountMutation = useCreateStudentDiscount();
  const updateDiscountMutation = useUpdateStudentDiscount();
  const toggleStatusMutation = useToggleDiscountStatus();
  const removeDiscountMutation = useRemoveStudentDiscount();
  const syncDiscountMutation = useSyncDiscountWithFees();

  const isLoading = studentsLoading || discountsLoading;

  const handleCreateDiscount = async (data: CreateStudentDiscountInput) => {
    try {
      await createDiscountMutation.mutateAsync({
        data: {
          ...data,
          studentId: selectedStudentId,
        },
        syncWithFees: true,
      });
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating discount:", err);
    }
  };

  const handleEditDiscount = async (data: UpdateStudentDiscountInput) => {
    if (selectedDiscount) {
      try {
        await updateDiscountMutation.mutateAsync({
          id: selectedDiscount._id,
          data,
          syncWithFees: true,
        });
        setIsEditModalOpen(false);
        setSelectedDiscount(null);
      } catch (err) {
        console.error("Error updating discount:", err);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id,
        syncWithFees: true,
      });
    } catch (err) {
      console.error("Error toggling discount status:", err);
    }
  };

  const handleRemoveDiscount = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this discount? This action cannot be undone.")) {
      try {
        await removeDiscountMutation.mutateAsync({
          id,
          syncWithFees: true,
        });
      } catch (err) {
        console.error("Error removing discount:", err);
      }
    }
  };

  const handleSyncDiscount = async (id: string) => {
    try {
      await syncDiscountMutation.mutateAsync(id);
      alert("Discount synchronized with student fees successfully.");
    } catch (err) {
      console.error("Error syncing discount:", err);
      alert("Failed to synchronize discount with student fees.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Student Discount Management
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedStudentId}
          className={`${!selectedStudentId 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2 rounded-lg`}
        >
          Add Discount
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <ClassSelector
            value={selectedClassId}
            onChange={setSelectedClassId}
            label="Select Class"
            placeholder="Search for a class..."
          />
          {selectedClassId && <StudentSelector
            value={selectedStudentId}
            classId={selectedClassId}
            onChange={setSelectedStudentId}
            label="Select Student"
            placeholder="Search for a student..."
          />}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : !selectedStudentId ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          Please select a student to view their discounts.
        </div>
      ) : discounts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No discounts found for this student.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add First Discount
          </button>
        </div>
      ) : (
        <StudentDiscountTable
          discounts={discounts}
          onEdit={(discount) => {
            setSelectedDiscount(discount);
            setIsEditModalOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          onRemove={handleRemoveDiscount}
          onSync={handleSyncDiscount}
        />
      )}

      <CreateDiscountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDiscount}
        isSubmitting={createDiscountMutation.isPending}
        studentId={selectedStudentId}
      />

      <EditDiscountModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDiscount(null);
        }}
        onSubmit={handleEditDiscount}
        discount={selectedDiscount}
        isSubmitting={updateDiscountMutation.isPending}
      />
    </div>
  );
};
