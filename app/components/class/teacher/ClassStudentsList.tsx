import { useState } from 'react';
import { Search } from 'lucide-react';
import type { StudentResponse } from '~/types/student';
import { useClasses } from '~/hooks/useClassQueries';
import { useSearchStudents } from '~/hooks/useStudentQueries';
import { StudentsSkeleton } from '~/components/student/StudentsSkeleton';
import { QuickAttendanceModal } from './QuickAttendanceModal';

interface Props {
  classId: string;
  className: string;
}

export function ClassStudentsList({ classId, className }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

  const { data: classes } = useClasses();
  const myClass = classes?.[0];

  const { data: students, isLoading } = useSearchStudents(
    myClass ? {
      gradeLevel: myClass.classGradeLevel,
      section: myClass.classSection
    } : undefined
  );

  if (isLoading) return <StudentsSkeleton />;

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Students Enrolled Yet
        </h3>
        <p className="text-gray-600">
          This class doesn't have any enrolled students
        </p>
      </div>
    );
  }

  const filteredStudents = searchTerm
    ? students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : students;

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-3 sm:p-4 lg:p-6 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-responsive-lg font-semibold text-gray-800">
                👥 Students in {className}
              </h2>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                {students.length} students enrolled
              </p>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.gradeLevel}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.className}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Mark Present
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <QuickAttendanceModal
          student={selectedStudent}
          classId={classId}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
}
