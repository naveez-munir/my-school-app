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
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 p-3 sm:p-4 lg:p-6 xl:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="icon-lg text-gray-600" />
            <h1 className="text-page-title font-bold tracking-tight">
              {userRole?.role === 'teacher' ? 'My Students' : 'Students'}
            </h1>
          </div>
          <p className="text-body-secondary mt-1">
            Manage student records, enrollments, and information
          </p>
        </div>

        {userIsAdmin && (
          <button
            onClick={() => navigate('/dashboard/students/new')}
            className="btn-primary flex items-center gap-1.5 sm:gap-2 transition-colors"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Add New Student
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <StudentsSkeleton />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-body">
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
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-red-50 rounded-lg">
            <Trash2 className="icon-lg text-red-600 flex-shrink-0" />
            <p className="text-body text-red-800">
              This action cannot be undone. This will permanently delete the student record.
            </p>
          </div>

          <p className="text-body text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.studentName}</strong>?
          </p>

          <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              onClick={() => setDeleteModal({ isOpen: false })}
              className="btn-secondary font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteStudentMutation.isPending}
              className="btn-danger font-medium disabled:opacity-50"
            >
              {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete Student'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
