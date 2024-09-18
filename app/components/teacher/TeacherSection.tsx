import { useState } from "react";
import { useNavigate } from "react-router";
import { TeacherTable } from "./TeacherTable";
import type { TeacherResponse } from "~/types/teacher";
import { useTeachers, useDeleteTeacher } from "~/hooks/useTeacherQueries";
import { isAdmin, getUserRole } from "~/utils/auth";
import { Modal } from "~/components/common/Modal";
import { Users, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "~/utils/error";

export function TeacherSection() {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; teacherId?: string; teacherName?: string }>({
    isOpen: false
  });

  const { data: teachers = [], isLoading: loading, error } = useTeachers();
  const deleteTeacherMutation = useDeleteTeacher();

  const navigate = useNavigate();
  const userIsAdmin = isAdmin();
  const userRole = getUserRole();

  const handleDeleteClick = (teacher: TeacherResponse) => {
    setDeleteModal({
      isOpen: true,
      teacherId: teacher.id,
      teacherName: teacher.name
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.teacherId) {
      deleteTeacherMutation.mutate(
        deleteModal.teacherId,
        {
          onSuccess: () => {
            toast.success(`Teacher ${deleteModal.teacherName} deleted successfully`);
            setDeleteModal({ isOpen: false });
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
            setDeleteModal({ isOpen: false });
          }
        }
      );
    }
  };

  const handleEdit = (teacher: TeacherResponse) => {
    navigate(`/dashboard/teachers/${teacher.id}/edit`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
            <h1 className="text-xs sm:text-sm lg:text-base font-bold tracking-tight text-gray-700">Teachers</h1>
          </div>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">
            Manage teacher records and assignments
          </p>
        </div>

        {userIsAdmin && (
          <button
            onClick={() => navigate('/dashboard/teachers/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Teacher
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center"><h4 className="text-sm text-gray-600">Loading....</h4></div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {(error as Error).message || "An error occurred"}
          </div>
        ) : (
          <TeacherTable
            data={teachers}
            onEdit={userIsAdmin ? handleEdit : undefined}
            onDelete={userIsAdmin ? handleDeleteClick : undefined}
          />
        )}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Teacher"
        size="sm"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-red-50 rounded-lg">
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-red-800">
              This action cannot be undone. This will permanently delete the teacher record.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.teacherName}</strong>?
          </p>

          <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              onClick={() => setDeleteModal({ isOpen: false })}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteTeacherMutation.isPending}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleteTeacherMutation.isPending ? 'Deleting...' : 'Delete Teacher'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
