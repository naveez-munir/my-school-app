import { useState } from "react";
import { StudentsSkeleton } from "./StudentsSkeleton";
import { StudentsTable } from "./StudentsTable";
import type { StudentResponse } from "~/types/student";
import { useNavigate } from "react-router";
import {
  useStudents,
  useDeleteStudent
} from "~/hooks/useStudentQueries";
import { ClassSelector } from "~/components/common/ClassSelector";
import { isAdmin, getUserRole } from "~/utils/auth";
import { Modal } from "~/components/common/Modal";
import { Filter, Users, Plus, Trash2 } from "lucide-react";

export function StudentSection() {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; studentId?: string; studentName?: string }>({
    isOpen: false
  });

  const { data: students = [], isLoading: loading, error } = useStudents();
  const deleteStudentMutation = useDeleteStudent();

  const navigate = useNavigate();
  const userIsAdmin = isAdmin();
  const userRole = getUserRole();

  const handleDeleteClick = (student: StudentResponse) => {
    setDeleteModal({
      isOpen: true,
      studentId: student.id,
      studentName: student.name
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.studentId) {
      deleteStudentMutation.mutate(deleteModal.studentId);
      setDeleteModal({ isOpen: false });
    }
  };

  const handleView = (student: StudentResponse) => {
    navigate(`/dashboard/students/${student.id}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">
              {userRole?.role === 'teacher' ? 'My Students' : 'Students'}
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage student records, enrollments, and information
          </p>
        </div>

        {userIsAdmin && (
          <button
            onClick={() => navigate('/dashboard/students/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Student
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <StudentsSkeleton />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {(error as Error).message || "An error occurred"}
          </div>
        ) : (
          <StudentsTable
            data={students}
            onView={handleView}
            onDelete={userIsAdmin ? handleDeleteClick : undefined}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Student"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <Trash2 className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">
              This action cannot be undone. This will permanently delete the student record.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.studentName}</strong>?
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
              disabled={deleteStudentMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete Student'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
