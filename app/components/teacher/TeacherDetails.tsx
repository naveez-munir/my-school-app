import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { fetchTeacherById, updateTeacherStatus } from '~/store/features/teacherSlice';
import { EmploymentStatus, type Teacher } from '~/types/teacher';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronsUpDown, Edit } from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'OnLeave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resigned':
        return 'bg-gray-100 text-gray-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function TeacherDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTeacher, loading } = useAppSelector((state) => state.teachers);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherById(id));
    }
  }, [dispatch, id]);

  const handleStatusChange = async (status: EmploymentStatus) => {
    if (id) {
      try {
        await dispatch(updateTeacherStatus({ teacherId: id, status })).unwrap();
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentTeacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentTeacher.firstName} {currentTeacher.lastName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">CNI: {currentTeacher.cniNumber}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/dashboard/teachers/${id}/edit`)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <Listbox value={currentTeacher.employmentStatus} onChange={handleStatusChange}>
            <div className="relative">
              <ListboxButton className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <StatusBadge status={currentTeacher.employmentStatus} />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                </span>
              </ListboxButton>
              <ListboxOptions className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                {Object.values(EmploymentStatus).map((status) => (
                  <ListboxOption key={status} value={status}>
                    {({ active }) => (
                      <li className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`}>
                        <StatusBadge status={status} />
                      </li>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <InfoSection title="Basic Information">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentTeacher.email || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentTeacher.phone || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentTeacher.gender}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentTeacher.bloodGroup || '-'}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentTeacher.address || '-'}</dd>
            </div>
          </dl>
        </InfoSection>

        {/* Employment Information */}
        <InfoSection title="Employment Information">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Joining Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(currentTeacher.joiningDate).toLocaleDateString()}
              </dd>
            </div>
            {currentTeacher.leavingDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Leaving Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(currentTeacher.leavingDate).toLocaleDateString()}
                </dd>
              </div>
            )}
            {currentTeacher.classTeacherOf && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Class Teacher Of</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentTeacher.classTeacherOf}
                </dd>
              </div>
            )}
          </dl>
        </InfoSection>

        {/* Education History */}
        <InfoSection title="Education History">
          {currentTeacher.educationHistory && currentTeacher.educationHistory.length > 0 ? (
            <div className="space-y-4">
              {currentTeacher.educationHistory.map((education, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">{education.degree}</h4>
                  <p className="text-sm text-gray-500">{education.institution}</p>
                  <p className="text-sm text-gray-500">Year: {education.year}</p>
                  {education.certificateUrl && (
                    <a
                      href={education.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No education history available</p>
          )}
        </InfoSection>

        {/* Experience */}
        <InfoSection title="Experience">
          {currentTeacher.experience && currentTeacher.experience.length > 0 ? (
            <div className="space-y-4">
              {currentTeacher.experience.map((exp, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">{exp.position}</h4>
                  <p className="text-sm text-gray-500">{exp.institution}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(exp.fromDate).toLocaleDateString()} - 
                    {exp.toDate ? new Date(exp.toDate).toLocaleDateString() : 'Present'}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-600">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No experience available</p>
          )}
        </InfoSection>

        {/* Documents */}
        <InfoSection title="Documents">
          {currentTeacher.documents && currentTeacher.documents.length > 0 ? (
            <div className="space-y-4">
              {currentTeacher.documents.map((doc, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.documentType}</h4>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(doc.uploadDate!).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Document
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No documents available</p>
          )}
        </InfoSection>
      </div>
    </div>
  );
}
