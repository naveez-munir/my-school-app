import type { StudentDataProps } from '~/types/student';
import { InfoCard } from './InfoCard';
import { formatDate } from '~/utils/dateUtils';

export function StudentOverview({ student }: StudentDataProps) {

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Student Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <InfoCard
          title="Personal Information"
          editPath="/edit/personal"
          studentId={student._id}
          fields={[
            { label: "Name", value: `${student.firstName} ${student.lastName}` },
            { label: "CNI Number", value: student.cniNumber },
            { label: "Date of Birth", value: formatDate(student.dateOfBirth) },
            { label: "Gender", value: student.gender },
            { label: "Blood Group", value: student.bloodGroup, fallback: "Not specified" }
          ]}
        />

        <InfoCard
          title="Contact Information"
          editPath="/edit/personal"
          studentId={student._id}
          fields={[
            { label: "Phone", value: student.phone },
            { label: "Email", value: student.email },
            { label: "Address", value: student.address }
          ]}
        />

        <InfoCard
          title="Academic Information"
          editPath="/edit/academic"
          studentId={student._id}
          fields={[
            { label: "Grade Level", value: student.class?.classGradeLevel },
            { label: "Class", value: student.class?.className, fallback: "Not assigned" },
            { label: "Roll Number", value: student.rollNumber, fallback: "Not assigned" },
            { label: "Enrollment Date", value: formatDate(student.enrollmentDate) },
            { label: "Admission Date", value: formatDate(student.admissionDate) }
          ]}
        />

        <InfoCard
          title="Guardian Information"
          editPath="/edit/guardian"
          studentId={student._id}
          fields={[
            { label: "Name", value: student.guardian.name },
            { label: "Relationship", value: student.guardian.relationship },
            { label: "CNI Number", value: student.guardian.cniNumber },
            { label: "Phone", value: student.guardian.phone },
            { label: "Email", value: student.guardian.email }
          ]}
        />

        <InfoCard
          title="Status Information"
          editPath="/edit/status"
          studentId={student._id}
          fields={[
            { 
              label: "Current Status",
              value: student.status,
              valueClassName: `font-medium ${
                student.status === 'Active' ? 'text-green-600' : 'text-red-600'
              }`
            },
            ...(student.exitStatus && student.exitStatus !== 'None' ? [
              { label: "Exit Status", value: student.exitStatus },
              { label: "Exit Date", value: formatDate(student.exitDate || '') },
              { label: "Exit Remarks", value: student.exitRemarks }
            ] : [])
          ]}
        />

        <InfoCard
          title="Documents"
          editPath="/edit/documents"
          studentId={student._id}
          fields={[
            { 
              label: "Documents",
              value: student.documents && student.documents.length > 0 
                ? `${student.documents.length} document(s) uploaded` 
                : "No documents uploaded"
            }
          ]}
        />
      </div>
    </div>
  );
}
