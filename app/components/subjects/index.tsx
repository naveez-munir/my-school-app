import { useEffect, useState } from "react";
import { SubjectFilters } from "./SubjectFilters";
import { SubjectsSkeleton } from "./SubjectsSkeleton";
import { SubjectModal } from "./SubjectModal";
import type { Subject, SubjectDto } from "~/types/subject";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { createSubject, deleteSubject, fetchSubjects, updateSubject } from "~/store/features/subjectSlice";

export const SubjectSection = () => {
  const dispatch = useAppDispatch();
  const { subjects, loading, error, filters } = useAppSelector((state) => state.subjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    dispatch(fetchSubjects(filters));
  }, [dispatch, filters]);

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
      <SubjectFilters />

      {loading ? (
        <SubjectsSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects?.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subject.subjectName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {subject.subjectCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(subject.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingSubject(subject);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(subject._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subjects?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No courses found. Add a new course to get started.
            </div>
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
      )}
    </div>
  );
};
