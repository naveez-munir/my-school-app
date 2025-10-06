import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { User, Phone, Mail, MapPin, Droplet, Calendar } from 'lucide-react';

/**
 * OPTION 1: Card-Based Layout with Grouped Fields
 * - Each field in its own card
 * - Better visual separation
 * - More spacious feel
 */
export function PersonalInfoOption1({ student }: StudentDataProps) {
  const fields = [
    { label: "Full Name", value: `${student.firstName} ${student.lastName}`, icon: User, color: "bg-blue-50" },
    { label: "Gender", value: student.gender, icon: User, color: "bg-purple-50" },
    { label: "CNI Number", value: student.cniNumber, icon: User, color: "bg-green-50" },
    { label: "Blood Group", value: student.bloodGroup || "Not specified", icon: Droplet, color: "bg-red-50" },
    { label: "Date of Birth", value: formatUserFriendlyDate(student.dateOfBirth), icon: Calendar, color: "bg-yellow-50" },
    { label: "Phone", value: student.phone, icon: Phone, color: "bg-indigo-50" },
    { label: "Email", value: student.email, icon: Mail, color: "bg-pink-50" },
    { label: "Address", value: student.address, icon: MapPin, color: "bg-teal-50" }
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      <StudentSectionHeader
        title="Personal Information"
        editPath="/edit/personal"
        studentId={student._id}
      />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={index} className={`${field.color} rounded-lg p-4 border border-gray-200`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{field.label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{field.value}</p>
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
 * - Left sidebar with key info (Name, CNI, DOB)
 * - Right side with contact details
 * - Similar to StudentOverview
 */
export function PersonalInfoOption2({ student }: StudentDataProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      <StudentSectionHeader
        title="Personal Information"
        editPath="/edit/personal"
        studentId={student._id}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Full Name</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">CNI Number</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{student.cniNumber}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Date of Birth</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{formatUserFriendlyDate(student.dateOfBirth)}</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Personal Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Gender</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{student.gender}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Blood Group</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{student.bloodGroup || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Details</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Phone className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Phone</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Mail className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{student.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <MapPin className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Address</p>
                  <p className="text-sm font-semibold text-gray-900 break-words">{student.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * OPTION 3: Horizontal List with Icons
 * - Clean horizontal layout
 * - Icons on the left
 * - Better for readability
 */
export function PersonalInfoOption3({ student }: StudentDataProps) {
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
    <div className="bg-white border border-gray-300 rounded-lg">
      <StudentSectionHeader
        title="Personal Information"
        editPath="/edit/personal"
        studentId={student._id}
      />
      <div className="p-6 space-y-8">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">{section.title}</h4>
            <div className="space-y-3">
              {section.fields.map((field, fieldIndex) => {
                const Icon = field.icon;
                return (
                  <div key={fieldIndex} className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{field.label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1 break-words">{field.value}</p>
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

/**
 * OPTION 4: Two-Column Grid with Better Spacing
 * - Clean 2-column grid
 * - Better visual hierarchy
 * - Organized sections
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
    <div className="bg-white border border-gray-300 rounded-lg">
      <StudentSectionHeader
        title="Personal Information"
        editPath="/edit/personal"
        studentId={student._id}
      />
      <div className="p-6 space-y-8">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">{section.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, fieldIndex) => {
                const Icon = field.icon;
                return (
                  <div key={fieldIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{field.label}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-2 break-words">{field.value}</p>
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

