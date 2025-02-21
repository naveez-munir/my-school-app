import { useEffect, useState } from "react";
import { StudentsSkeleton } from "./StudentsSkeleton";
import { StudentFilter } from "./StudentFilter";
import { StudentsTable } from "./StudentsTable";
import type { Student, CreateStudentDto, StudentResponse } from "~/types/student";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { 
  createStudent, 
  deleteStudent, 
  fetchStudents, 
  updateStudent 
} from "~/store/features/studentSlice";
import { useNavigate } from "react-router";

export function StudentSection() {
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector((state) => state.students);
  const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleDelete = async(id: string) => {
    //TODO we need to add prompt take confirmation first
    await dispatch(deleteStudent(id));
  };
  const handleEdit = (student: StudentResponse) => {
    navigate(`/dashboard/students/${student.id}/edit`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">Students</h1>
          <p className="text-sm text-gray-500">
            Manage student records, enrollments, and information
          </p>
        </div>
        <button
          onClick={() => {navigate('/dashboard/students/new')}}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add New Student
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <StudentsSkeleton />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        ) : (
          <StudentsTable
            data={students}
            onEdit={(student) => {
              handleEdit(student);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
