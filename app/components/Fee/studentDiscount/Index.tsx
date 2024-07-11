import { useState, useMemo } from "react";
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
import { Modal } from "~/components/common/Modal";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const StudentDiscountSection = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<StudentDiscount | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; discountId?: string; discountType?: string }>({
    isOpen: false
  });

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

  const filteredDiscounts = useMemo(() => {
    if (statusFilter === "all") return discounts;
    if (statusFilter === "active") return discounts.filter(d => d.isActive);
    if (statusFilter === "inactive") return discounts.filter(d => !d.isActive);
    return discounts;
  }, [discounts, statusFilter]);

  const handleCreateDiscount = async (data: CreateStudentDiscountInput) => {
    try {
      await createDiscountMutation.mutateAsync({
        data: {
          ...data,
          studentId: selectedStudentId,
        },
        syncWithFees: true,
      });
      toast.success("Discount created successfully!");
      setIsCreateModalOpen(false);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message?.message || err?.message || "Failed to create discount";
      toast.error(errorMessage);
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
          studentId: selectedStudentId,
        });
        toast.success("Discount updated successfully!");
        setIsEditModalOpen(false);
        setSelectedDiscount(null);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message?.message || err?.message || "Failed to update discount";
        toast.error(errorMessage);
        console.error("Error updating discount:", err);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const discount = discounts.find(d => d._id === id);
      await toggleStatusMutation.mutateAsync({
        id,
        syncWithFees: true,
        studentId: selectedStudentId,
      });
      toast.success(discount?.isActive ? "Discount deactivated successfully!" : "Discount activated successfully!");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message?.message || err?.message || "Failed to toggle discount status";
      toast.error(errorMessage);
      console.error("Error toggling discount status:", err);
    }
  };

  const handleRemoveDiscount = (id: string) => {
    const discount = discounts.find(d => d._id === id);
    setDeleteModal({
      isOpen: true,
      discountId: id,
      discountType: discount?.discountType
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.discountId) {
      try {
        await removeDiscountMutation.mutateAsync({
          id: deleteModal.discountId,
          syncWithFees: true,
          studentId: selectedStudentId,
        });
        toast.success("Discount deleted successfully!");
        setDeleteModal({ isOpen: false });
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message?.message || err?.message || "Failed to delete discount";
        toast.error(errorMessage);
        console.error("Error removing discount:", err);
      }
    }
  };

  const handleSyncDiscount = async (id: string) => {
    try {
      await syncDiscountMutation.mutateAsync(id);
      toast.success("Discount synchronized with student fees successfully!");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message?.message || err?.message || "Failed to synchronize discount";
      toast.error(errorMessage);
      console.error("Error syncing discount:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Student Discount Management
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedStudentId}
          className={`${!selectedStudentId
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2.5 rounded-lg text-sm font-medium`}
        >
          Add Discount
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
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

      {selectedStudentId && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status Filter:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All ({discounts.length})
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "active"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Active ({discounts.filter(d => d.isActive).length})
              </button>
              <button
                onClick={() => setStatusFilter("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "inactive"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Inactive ({discounts.filter(d => !d.isActive).length})
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">{(error as Error).message}</div>
      ) : !selectedStudentId ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg text-sm">
          Please select a student to view their discounts.
        </div>
      ) : discounts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-sm">No discounts found for this student.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Add First Discount
          </button>
        </div>
      ) : filteredDiscounts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-sm">No {statusFilter} discounts found for this student.</p>
        </div>
      ) : (
        <StudentDiscountTable
          discounts={filteredDiscounts}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Discount"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <Trash2 className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">
              This action cannot be undone. This will permanently delete the discount.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete the <strong>{deleteModal.discountType?.replace(/_/g, ' ')}</strong> discount?
            This will also remove the discount from all applicable student fees.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setDeleteModal({ isOpen: false })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={removeDiscountMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {removeDiscountMutation.isPending ? 'Deleting...' : 'Delete Discount'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
