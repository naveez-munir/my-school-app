import type { StudentDataProps } from '~/types/student';
import { QuickInfoCard } from './QuickInfoCard';
import { DetailSection } from './DetailSection';
import { DocumentsCard } from './DocumentsCard';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { Phone, Mail, MapPin, BookOpen, Users } from 'lucide-react';

export function StudentOverview({ student }: StudentDataProps) {

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Student Overview</h3>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <QuickInfoCard student={student} />
          <DocumentsCard
            documents={student.documents}
            editPath="/edit/documents"
            studentId={student._id}
          />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Contact Details */}
          <DetailSection
            title="Contact Details"
            editPath="/edit/personal"
            studentId={student._id}
            columns={3}
            fields={[
              { label: "Phone Number", value: student.phone, icon: Phone },
              { label: "Email Address", value: student.email, icon: Mail },
              { label: "Residential Address", value: student.address, icon: MapPin }
            ]}
          />

          {/* Academic Details */}
          <DetailSection
            title="Academic Details"
            editPath="/edit/academic"
            studentId={student._id}
            columns={3}
            fields={[
              { label: "Grade Level", value: student.class?.classGradeLevel, icon: BookOpen },
              { label: "Class", value: student.class?.className, fallback: "Not assigned", icon: BookOpen },
              { label: "Roll Number", value: student.rollNumber, fallback: "Not assigned", icon: BookOpen }
            ]}
          />

          {/* Guardian Information */}
          <DetailSection
            title="Guardian Information"
            editPath="/edit/guardian"
            studentId={student._id}
            columns={2}
            fields={[
              { label: "Guardian Name", value: student.guardian.name, icon: Users },
              { label: "Relationship", value: student.guardian.relationship, icon: Users },
              { label: "Phone Number", value: student.guardian.phone, icon: Phone },
              { label: "Email Address", value: student.guardian.email, icon: Mail }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
