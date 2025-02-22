import { useEffect, useState } from "react";
import { ClassesSkeleton } from "./ClassesSkeleton";
import { ClassesTable } from "./ClassTable";
import type { ClassResponse } from "~/types/class";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { 
  createClass, 
  deleteClass, 
  fetchClasses, 
  updateClass 
} from "~/store/features/classSlice";
import { useNavigate } from "react-router";

export function ClassSection() {
  const dispatch = useAppDispatch();
  const { classes, loading, error } = useAppSelector((state) => state.classes);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleDelete = async(id: string) => {
    //TODO: Add confirmation prompt before deletion
    await dispatch(deleteClass(id));
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
        {loading ? (
          <ClassesSkeleton />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
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
