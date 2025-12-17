import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { User, Phone, Mail, MapPin, Droplet, Calendar } from 'lucide-react';

/**
 * Personal Information Component
 * Two-column grid with organized sections
 */
export function PersonalInfoOption4({ student }: StudentDataProps) {
  const sections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Full Name", value: `${student.firstName} ${student.lastName}`, icon: User },
        { label: "Gender", value: student.gender, icon: User },
        { label: "CNI Number", value: student.cniNumber, icon: User },
        { label: "Blood Group", value: student.bloodGroup || "Not specified", icon: Droplet },
        { label: "Date of Birth", value: formatUserFriendlyDate(student.dateOfBirth), icon: Calendar }
      ]
    },
    {
      title: "Contact Information",
      fields: [
        { label: "Phone", value: student.phone, icon: Phone },
        { label: "Email", value: student.email, icon: Mail },
        { label: "Address", value: student.address, icon: MapPin }
      ]
    }
  ];

  return (
    <div className="card">
      <StudentSectionHeader
        title="Personal Information"
        editPath="/edit/personal"
        studentId={student._id}
      />
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="text-heading mb-3 sm:mb-4">{section.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {section.fields.map((field, fieldIndex) => {
                const Icon = field.icon;
                return (
                  <div key={fieldIndex} className="info-box-hover">
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
        ))}
      </div>
    </div>
  );
}

