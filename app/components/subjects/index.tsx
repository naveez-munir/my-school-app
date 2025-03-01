import { useState } from "react";
import { SubjectsSkeleton } from "./SubjectsSkeleton";
import { SubjectModal } from "./SubjectModal";
import type { Subject, SubjectDto } from "~/types/subject";
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from "~/hooks/useSubjectQueries";
import { SubjectsTable } from "./SubjectsTable";

export const SubjectSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // React Query hooks
  const { 
    data: subjects = [], 
    isLoading, 
    error 
  } = useSubjects();
  
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();

  const handleCreate = async (data: SubjectDto) => {
    try {
      await createSubjectMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating subject:", err);
    }
  };

  const handleUpdate = async (data: SubjectDto) => {
    if (editingSubject) {
      try {
        await updateSubjectMutation.mutateAsync({ 
          id: editingSubject._id, 
          data 
        });
        setIsModalOpen(false);
        setEditingSubject(null);
      } catch (err) {
        console.error("Error updating subject:", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteSubjectMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting subject:", err);
      }
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

      {isLoading ? (
        <SubjectsSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
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
        isSubmitting={createSubjectMutation.isPending || updateSubjectMutation.isPending}
      />
    </div>
  );
};
