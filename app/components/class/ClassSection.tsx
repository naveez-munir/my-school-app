import { ClassesSkeleton } from "./ClassesSkeleton";
import { ClassesTable } from "./ClassTable";
import type { ClassResponse } from "~/types/class";
import { useClasses, useDeleteClass } from "~/hooks/useClassQueries";
import { useNavigate } from "react-router";

export function ClassSection() {
  const navigate = useNavigate();
  
  // Fetch classes with React Query
  const { 
    data: classes = [], 
    isLoading, 
    error 
  } = useClasses();
  
  // Delete class mutation
  const deleteClassMutation = useDeleteClass();

  const handleDelete = async(id: string) => {
    //TODO: Add confirmation prompt before deletion
    await deleteClassMutation.mutateAsync(id);
  };

  const handleEdit = (classItem: ClassResponse) => {
    navigate(`/dashboard/classes/${classItem.id}/edit`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">Classes</h1>
          <p className="text-sm text-gray-500">
            Manage class assignments, sections, and teacher allocations
          </p>
        </div>
        <button
          onClick={() => {navigate('/dashboard/classes/new')}}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add New Class
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <ClassesSkeleton />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {(error as Error).message}
          </div>
        ) : (
          <ClassesTable
            data={classes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
