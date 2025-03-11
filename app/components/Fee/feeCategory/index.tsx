import { useState } from "react";
import type { FeeCategory, CreateFeeCategoryInput } from "~/types/studentFee";
import { 
  useFeeCategories, 
  useCreateFeeCategory, 
  useUpdateFeeCategory, 
  useDeleteFeeCategory,
  useToggleFeeCategoryStatus
} from "~/hooks/useFeeCategoryQueries";
import { FeeCategoriesSkeleton } from "./FeeCategoriesSkeleton";
import { FeeCategoriesTable } from "./FeeCategoriesTable";
import { FeeCategoryModal } from "./FeeCategoryModal";

export const FeeCategorySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeeCategory | null>(null);

  // React Query hooks
  const { 
    data: categories = [], 
    isLoading, 
    error 
  } = useFeeCategories({ isActive: true });
  
  const createCategoryMutation = useCreateFeeCategory();
  const updateCategoryMutation = useUpdateFeeCategory();
  const deleteCategoryMutation = useDeleteFeeCategory();
  const toggleStatusMutation = useToggleFeeCategoryStatus();

  const handleCreate = async (data: CreateFeeCategoryInput) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating fee category:", err);
    }
  };

  const handleUpdate = async (data: CreateFeeCategoryInput) => {
    if (editingCategory) {
      try {
        await updateCategoryMutation.mutateAsync({ 
          id: editingCategory._id, 
          data 
        });
        setIsModalOpen(false);
        setEditingCategory(null);
      } catch (err) {
        console.error("Error updating fee category:", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee category?')) {
      try {
        await deleteCategoryMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting fee category:", err);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatusMutation.mutateAsync(id);
    } catch (err) {
      console.error("Error toggling fee category status:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Fee Category Management
        </h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Fee Category
        </button>
      </div>

      {isLoading ? (
        <FeeCategoriesSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : (
        <FeeCategoriesTable
          data={categories}
          onEdit={(category) => {
            setEditingCategory(category);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <FeeCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
        initialData={editingCategory || undefined}
        isSubmitting={createCategoryMutation.isPending || updateCategoryMutation.isPending}
      />
    </div>
  );
};
