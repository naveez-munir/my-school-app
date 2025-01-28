import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { Users, User, Phone, Mail } from 'lucide-react';

/**
 * Guardian Information Component
 * Two-column grid layout with clean visual hierarchy
 */
export function GuardianInfoOption4({ student }: StudentDataProps) {
  const fields = [
    { label: "Guardian Name", value: student.guardian.name, icon: Users },
    { label: "Relationship", value: student.guardian.relationship, icon: Users },
    { label: "CNI Number", value: student.guardian.cniNumber, icon: User },
    { label: "Phone", value: student.guardian.phone, icon: Phone },
    { label: "Email", value: student.guardian.email, icon: Mail }
  ];

  return (
    <div className="card">
      <StudentSectionHeader
        title="Guardian Information"
        editPath="/edit/guardian"
        studentId={student._id}
      />
      <div className="p-4 sm:p-6">
        <h4 className="text-heading mb-3 sm:mb-4">Guardian Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={index} className="info-box-hover">
                <div className="flex-start">
                  <Icon className="icon-lg text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-section-title">{field.label}</p>
                    <p className="text-body font-semibold mt-2 break-words">{field.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

