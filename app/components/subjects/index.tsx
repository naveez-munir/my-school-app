import { useEffect, useState } from "react";
import { SubjectsSkeleton } from "./SubjectsSkeleton";
import { SubjectModal } from "./SubjectModal";
import type { Subject, SubjectDto } from "~/types/subject";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { createSubject, deleteSubject, fetchSubjects, updateSubject } from "~/store/features/subjectSlice";
import { SubjectsTable } from "./SubjectsTable";

export const SubjectSection = () => {
  const dispatch = useAppDispatch();
  const { subjects, loading, error } = useAppSelector((state) => state.subjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    // Fetch all subjects at once since we're doing client-side pagination
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleCreate = async (data: SubjectDto) => {
    await dispatch(createSubject(data));
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: SubjectDto) => {
    if (editingSubject) {
      await dispatch(updateSubject({ id: editingSubject._id, data }));
      setIsModalOpen(false);
      setEditingSubject(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await dispatch(deleteSubject(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Course Management
        </h2>
        <button
          onClick={() => {
            setEditingSubject(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Course
        </button>
      </div>

      {loading ? (
        <SubjectsSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      ) : (
        <SubjectsTable
          data={subjects}
          onEdit={(subject) => {
            setEditingSubject(subject);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={editingSubject ? handleUpdate : handleCreate}
        initialData={editingSubject || undefined}
      />
    </div>
  );
};
