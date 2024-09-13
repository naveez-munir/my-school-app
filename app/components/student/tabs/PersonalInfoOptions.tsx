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
    <div className="card">
      <StudentSectionHeader
        title="Personal Information"
        editPath="/edit/personal"
        studentId={student._id}
      />
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
 * - Left sidebar with key info (Name, CNI, DOB)
 * - Right side with contact details
 * - Similar to StudentOverview
 */
export function PersonalInfoOption2({ student }: StudentDataProps) {
  return (
    <div className="card">
      <StudentSectionHeader
        title="Personal Information"
        editPath="/edit/personal"
        studentId={student._id}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <div className="info-box">
            <div className="flex-center mb-2">
              <User className="icon-md text-gray-600" />
              <span className="text-section-title">Full Name</span>
            </div>
            <p className="text-body font-semibold">{student.firstName} {student.lastName}</p>
          </div>

          <div className="info-box">
            <div className="flex-center mb-2">
              <User className="icon-md text-gray-600" />
              <span className="text-section-title">CNI Number</span>
            </div>
            <p className="text-body font-semibold">{student.cniNumber}</p>
          </div>

          <div className="info-box">
            <div className="flex-center mb-2">
              <Calendar className="icon-md text-gray-600" />
              <span className="text-section-title">Date of Birth</span>
            </div>
            <p className="text-body font-semibold">{formatUserFriendlyDate(student.dateOfBirth)}</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Personal Details */}
          <div>
            <h4 className="text-heading mb-3 sm:mb-4">Personal Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="info-box">
                <div className="flex-center mb-2">
                  <User className="icon-md text-gray-600" />
                  <span className="text-section-title">Gender</span>
                </div>
                <p className="text-body font-semibold">{student.gender}</p>
              </div>
              <div className="info-box">
                <div className="flex-center mb-2">
                  <Droplet className="icon-md text-gray-600" />
                  <span className="text-section-title">Blood Group</span>
                </div>
                <p className="text-body font-semibold">{student.bloodGroup || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-heading mb-3 sm:mb-4">Contact Details</h4>
            <div className="space-y-3">
              <div className="flex-start info-box">
                <Phone className="icon-md text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-section-title">Phone</p>
                  <p className="text-body font-semibold break-words mt-1">{student.phone}</p>
                </div>
              </div>
              <div className="flex-start info-box">
                <Mail className="icon-md text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-section-title">Email</p>
                  <p className="text-body font-semibold break-words mt-1">{student.email}</p>
                </div>
              </div>
              <div className="flex-start info-box">
                <MapPin className="icon-md text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-section-title">Address</p>
                  <p className="text-body font-semibold break-words mt-1">{student.address}</p>
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
            <div className="space-y-3">
              {section.fields.map((field, fieldIndex) => {
                const Icon = field.icon;
                return (
                  <div key={fieldIndex} className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
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

