import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { BookOpen, Calendar, BarChart3 } from 'lucide-react';

export function StudentAcademicInfo({student} : StudentDataProps) {
  const classInfoFields = [
    { label: "Grade Level", value: student.class?.classGradeLevel, fallback: "Not assigned", icon: BookOpen },
    { label: "Class", value: student.class?.className, fallback: "Not assigned", icon: BookOpen },
    { label: "Roll Number", value: student.rollNumber, fallback: "Not assigned", icon: BookOpen }
  ];

  const enrollmentFields = [
    { label: "Enrollment Date", value: formatUserFriendlyDate(student.enrollmentDate), fallback: "Not provided", icon: Calendar },
    { label: "Admission Date", value: formatUserFriendlyDate(student.admissionDate), fallback: "Not provided", icon: Calendar },
    {
      label: "Attendance",
      value: student.attendancePercentage !== undefined
        ? `${student.attendancePercentage.toFixed(1)}%`
        : 'Not recorded',
      fallback: "Not recorded",
      icon: BarChart3
    }
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      <StudentSectionHeader
        title="Academic Information"
        editPath="/edit/academic"
        studentId={student._id}
      />

      <div className="p-6 space-y-8">
        {/* Class Information Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Class Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classInfoFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{field.label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-2 break-words">
                        {field.value !== undefined && field.value !== null ? field.value : (field.fallback || 'Not provided')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enrollment Information Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Enrollment Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollmentFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{field.label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-2 break-words">
                        {field.value !== undefined && field.value !== null ? field.value : (field.fallback || 'Not provided')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
