import { useNavigate } from "react-router";
import { TeacherTable } from "./TeacherTable";
import type { TeacherResponse } from "~/types/teacher";
import { useTeachers, useDeleteTeacher } from "~/hooks/useTeacherQueries";

export function TeacherSection() {
  const navigate = useNavigate();
  
  // React Query hooks
  const { data: teachers = [], isLoading: loading, error } = useTeachers();
  const deleteTeacherMutation = useDeleteTeacher();

  const handleDelete = async(id: string) => {
    //TODO: Add confirmation prompt before deletion
    deleteTeacherMutation.mutate(id);
  };

  const handleEdit = (teacher: TeacherResponse) => {
    navigate(`/dashboard/teachers/${teacher.id}/edit`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">Teachers</h1>
          <p className="text-sm text-gray-500">
            Manage teachers
          </p>
        </div>
        <button
          onClick={() => {navigate('/dashboard/teachers/new')}}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add New Teacher
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div><h4>Loading....</h4></div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {(error as Error).message || "An error occurred"}
          </div>
        ) : (
          <TeacherTable
            data={teachers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
