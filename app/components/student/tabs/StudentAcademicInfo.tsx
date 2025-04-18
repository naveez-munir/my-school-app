import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatDate } from '~/utils/dateUtils';

export function StudentAcademicInfo({student} : StudentDataProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <StudentSectionHeader
        title="Academic Information" 
        editPath="/edit/academic" 
        studentId={student._id} 
      />

      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Class Information</h4>
            <dl className="mt-2 space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Grade Level</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.class?.classGradeLevel}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Class</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.class?.className || 'Not assigned'}</dd>
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
