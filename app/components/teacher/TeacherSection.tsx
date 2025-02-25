import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useNavigate } from "react-router";
import { deleteTeacher, fetchTeachers } from "~/store/features/teacherSlice";
import { TeacherTable } from "./TeacherTable";
import type { TeacherResponse } from "~/types/teacher";

export function TeacherSection() {
  const dispatch = useAppDispatch();
  const { teachers, loading, error } = useAppSelector((state) => state.teachers);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleDelete = async(id: string) => {
    //TODO: Add confirmation prompt before deletion
    await dispatch(deleteTeacher(id));
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
            {error}
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
