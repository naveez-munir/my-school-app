import { Tab } from '@headlessui/react';
import { ChevronLeft, Edit, Download, Calendar, Phone, Mail, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router';
import { useStudent } from '~/hooks/useStudentQueries';
import { StudentStatus } from '~/types/student';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading, isError } = useStudent(id || '');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Student not found</h2>
        <button 
          onClick={() => navigate('/dashboard/students')}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Students List
        </button>
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Get status badge color
  const getStatusColor = (status?: StudentStatus) => {
    switch (status) {
      case StudentStatus.Active:
        return 'bg-green-100 text-green-800';
      case StudentStatus.Inactive:
        return 'bg-gray-100 text-gray-800';
      case StudentStatus.Graduated:
        return 'bg-blue-100 text-blue-800';
      case StudentStatus.Expelled:
        return 'bg-red-100 text-red-800';
      case StudentStatus.Withdrawn:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Student Details
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View complete student information
          </p>
        </div>
        <div className="space-x-3">
          <button
            onClick={() => navigate('/dashboard/students')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to List
          </button>
          <button
            onClick={() => navigate(`/dashboard/students/${id}/edit`)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Student Profile Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              <div className="relative">
                {student.photoUrl ? (
                  <img 
                    className="h-20 w-20 rounded-full object-cover"
                    src={student.photoUrl} 
                    alt={`${student.firstName} ${student.lastName}`} 
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <span className={classNames(
                  "absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white",
                  student.status === StudentStatus.Active ? "bg-green-400" : "bg-gray-400"
                )} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">
                {student.firstName} {student.lastName}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  Grade {student.gradeLevel}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {student.email || 'N/A'}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {student.phone || 'N/A'}
                </div>
              </div>
              <div className="mt-2">
                <span className={classNames(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  getStatusColor(student.status)
                )}>
                  {student.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200 px-6 bg-gray-50">
            {['Basic Info', 'Guardian', 'Academic', 'Documents'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'py-3 px-4 text-sm font-medium border-b-2 focus:outline-none',
                    selected
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="px-6 py-4">
            {/* Basic Info Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.firstName} {student.lastName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">CNI Number</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.cniNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Gender</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.gender}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Blood Group</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.bloodGroup || 'Not specified'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(student.dateOfBirth)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Guardian Info Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Guardian Name</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.guardian.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Relationship</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.guardian.relationship}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">CNI Number</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.guardian.cniNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.guardian.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.guardian.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Academic Info Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Grade Level</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.gradeLevel}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Class</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.class || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Roll Number</h4>
                    <p className="mt-1 text-sm text-gray-900">{student.rollNumber || 'Not assigned'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Enrollment Date</h4>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(student.enrollmentDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Admission Date</h4>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(student.admissionDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Attendance</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {student.attendancePercentage 
                        ? `${student.attendancePercentage.toFixed(1)}%` 
                        : 'No data available'}
                    </p>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Documents Panel */}
            <Tab.Panel>
              {student.documents && student.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.documents.map((doc, index) => (
                    <div key={index} className="border rounded-md p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{doc.documentType}</h4>
                        <p className="text-xs text-gray-500">
                          {doc.uploadDate ? formatDate(doc.uploadDate.toString()) : 'No date'}
                        </p>
                      </div>
                      <a 
                        href={doc.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No documents uploaded</p>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Exit Status (if applicable) */}
        {student.exitStatus && student.exitStatus !== 'None' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Exit Information</h3>
                <div className="mt-2 flex space-x-4">
                  <div>
                    <span className="text-xs text-gray-500">Status:</span>
                    <span className={classNames(
                      "ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      student.exitStatus === 'Completed' || student.exitStatus === 'Migrated' 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    )}>
                      {student.exitStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Date:</span>
                    <span className="ml-2 text-xs text-gray-900">{formatDate(student.exitDate)}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {student.exitRemarks || 'No remarks'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
