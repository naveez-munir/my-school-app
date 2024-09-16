import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { Users, User, Phone, Mail, MapPin } from 'lucide-react';

/**
 * OPTION 1: Card Grid Layout
 * - Each field in its own card
 * - Colorful and visual
 * - Great for quick scanning
 */
export function GuardianInfoOption1({ student }: StudentDataProps) {
  const fields = [
    { label: "Guardian Name", value: student.guardian.name, icon: Users, color: "bg-blue-50" },
    { label: "Relationship", value: student.guardian.relationship, icon: Users, color: "bg-purple-50" },
    { label: "CNI Number", value: student.guardian.cniNumber, icon: User, color: "bg-green-50" },
    { label: "Phone", value: student.guardian.phone, icon: Phone, color: "bg-indigo-50" },
    { label: "Email", value: student.guardian.email, icon: Mail, color: "bg-pink-50" }
  ];

  return (
    <div className="card">
      <StudentSectionHeader
        title="Guardian Information"
        editPath="/edit/guardian"
        studentId={student._id}
      />
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={index} className={`${field.color} rounded-lg p-3 sm:p-4 border border-gray-200`}>
                <div className="flex-center mb-2">
                  <Icon className="icon-md text-gray-600" />
                  <span className="text-section-title">{field.label}</span>
                </div>
                <p className="text-body font-semibold line-clamp-2">{field.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * OPTION 2: Sidebar + Main Content Layout
 * - Left sidebar with key guardian info
 * - Right side with contact details
 */
export function GuardianInfoOption2({ student }: StudentDataProps) {
  return (
    <div className="card">
      <StudentSectionHeader
        title="Guardian Information"
        editPath="/edit/guardian"
        studentId={student._id}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <div className="info-box">
            <div className="flex-center mb-2">
              <Users className="icon-md text-gray-600" />
              <span className="text-section-title">Guardian Name</span>
            </div>
            <p className="text-body font-semibold">{student.guardian.name}</p>
          </div>

          <div className="info-box">
            <div className="flex-center mb-2">
              <Users className="icon-md text-gray-600" />
              <span className="text-section-title">Relationship</span>
            </div>
            <p className="text-body font-semibold">{student.guardian.relationship}</p>
          </div>

          <div className="info-box">
            <div className="flex-center mb-2">
              <User className="icon-md text-gray-600" />
              <span className="text-section-title">CNI Number</span>
            </div>
            <p className="text-body font-semibold">{student.guardian.cniNumber}</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2">
          <h4 className="text-heading mb-3 sm:mb-4">Contact Information</h4>
          <div className="space-y-3">
            <div className="flex-start info-box">
              <Phone className="icon-md text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-section-title">Phone</p>
                <p className="text-body font-semibold break-words mt-1">{student.guardian.phone}</p>
              </div>
            </div>
            <div className="flex-start info-box">
              <Mail className="icon-md text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-section-title">Email</p>
                <p className="text-body font-semibold break-words mt-1">{student.guardian.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * OPTION 3: Horizontal List Layout
 * - Clean horizontal list items
 * - Icons on the left
 * - Best for readability
 */
export function GuardianInfoOption3({ student }: StudentDataProps) {
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
        <div className="space-y-3">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Icon className="icon-lg text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-section-title">{field.label}</p>
                  <p className="text-body font-semibold mt-1 break-words">{field.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * OPTION 4: Two-Column Grid Layout
 * - Clean 2-column grid
 * - Better visual hierarchy
 * - Organized sections
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

