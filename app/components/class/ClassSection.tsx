import { ClassesSkeleton } from "./ClassesSkeleton";
import { ClassesTable } from "./ClassTable";
import type { ClassResponse } from "~/types/class";
import { useClasses, useDeleteClass } from "~/hooks/useClassQueries";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import DeletePrompt from "../common/DeletePrompt";
import { getUserRole, isAdminRole } from '~/utils/auth';
import { UserRoleEnum } from '~/types/user';
import { TeacherClassView } from './teacher/TeacherClassView';

export function ClassSection() {
  const userRole = getUserRole();
  const role = userRole?.role;

  if (isAdminRole(role)) {
    return <AdminClassManagement />;
  }

  if (role === UserRoleEnum.TEACHER) {
    return <TeacherClassView />;
  }

  return (
    <div className="p-6 text-center">
      <div className="text-red-600 text-lg font-medium">
        You do not have permission to access this page
      </div>
    </div>
  );
}

function AdminClassManagement() {
  const navigate = useNavigate();
  const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false);
  const [classToDelete, setClassToDelete] = useState<string>('');

  const {
    data: classes = [],
    isLoading,
    error
  } = useClasses();

  const deleteClassMutation = useDeleteClass();

  const handleDelete = async() => {
    await deleteClassMutation.mutateAsync(classToDelete);
    toast.success("Class deleted successfully");
    setShowDeletePrompt(false);
    setClassToDelete('');
  };

  const handleDeleteClick = (id: string) => {
    setShowDeletePrompt(true);
    setClassToDelete(id);
  };

  const handleEdit = (classItem: ClassResponse) => {
    navigate(`/dashboard/classes/${classItem.id}/edit`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xs sm:text-sm lg:text-base font-bold tracking-tight text-gray-700">Classes</h1>
          <p className="text-xs lg:text-sm text-gray-500">
            Manage class assignments, sections, and teacher allocations
          </p>
        </div>
        <button
          onClick={() => {navigate('/dashboard/classes/new')}}
          className="w-full sm:w-auto bg-blue-600 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add New Class
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <ClassesSkeleton />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {(error as Error).message}
          </div>
        ) : (
          <ClassesTable
            data={classes}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
        <DeletePrompt
          isOpen={showDeletePrompt}
          onClose={() => setShowDeletePrompt(false)}
          onConfirm={handleDelete}
          itemName="class"
        />
      </div>
    </div>
  );
}
