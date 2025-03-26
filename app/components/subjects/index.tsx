import { useState } from "react";
import { SubjectsSkeleton } from "./SubjectsSkeleton";
import { SubjectModal } from "./SubjectModal";
import toast from "react-hot-toast";
import type { Subject, SubjectDto } from "~/types/subject";
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from "~/hooks/useSubjectQueries";
import { useQueryClient } from '@tanstack/react-query';
import { SubjectsTable } from "./SubjectsTable";
import DeletePrompt from "../common/DeletePrompt";

export const SubjectSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletePromptOpen, setDeletePromptOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);


  // React Query hooks
  const { 
    data: subjects = [], 
    isLoading, 
    error 
  } = useSubjects();
  
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();
  const queryClient = useQueryClient();

  const handleCreate = async (data: SubjectDto) => {
    try {
      await createSubjectMutation.mutateAsync(data);
      setIsModalOpen(false);
      toast.success("Course created successfully");
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    } catch (err) {
      handleError(err)
    }
  };

  const handleUpdate = async (data: SubjectDto) => {
    if (editingSubject) {
      try {
        const payLoad = {
          subjectName: data.subjectName,
          subjectCode: data.subjectCode
        };
        await updateSubjectMutation.mutateAsync({ 
          id: editingSubject._id, 
          data: payLoad
        });
        setIsModalOpen(false);
        setEditingSubject(null);
        toast.success("Course updated successfully");
        queryClient.invalidateQueries({ queryKey: ['subjects'] });
      } catch (err) {
         handleError(err)
      }
    }
  };

  const handleError = (err : any) => {
    const errorMessage = err.response?.data?.message?.message || "some thing went wrong";
    toast.error(errorMessage);
  }

  const handleDeleteClick = (id: string) => {
    setSubjectToDelete(id);
    setDeletePromptOpen(true);
  };

  const confirmDelete = async () => {
    if (subjectToDelete) {
      try {
        await deleteSubjectMutation.mutateAsync(subjectToDelete);
        toast.success("Course deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['subjects'] });
      } catch (err) {
        handleError(err)
      } finally {
        setDeletePromptOpen(false);
        setSubjectToDelete(null);
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
          onDelete={handleDeleteClick}
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

      <DeletePrompt
        isOpen={deletePromptOpen}
        onClose={() => setDeletePromptOpen(false)}
        onConfirm={confirmDelete}
        itemName="course"
      />
    </div>
  );
};
