import { useNavigate } from 'react-router';
import type { Student } from '~/types/student';

interface StudentDataProps {
  student: Student;
}

export function StudentAcademicInfo({student} : StudentDataProps) {
  const navigate = useNavigate();
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Academic Information</h3>
        <button 
          onClick={() => navigate(`/dashboard/students/${student._id}/edit/academic`)}
          className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
        >
          Edit
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Class Information</h4>
            <dl className="mt-2 space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Grade Level</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.gradeLevel}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Class</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.class || 'Not assigned'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.rollNumber || 'Not assigned'}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Enrollment Information</h4>
            <dl className="mt-2 space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Enrollment Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(student.enrollmentDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Admission Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(student.admissionDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Attendance</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {student.attendancePercentage !== undefined 
                    ? `${student.attendancePercentage.toFixed(1)}%` 
                    : 'Not recorded'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
