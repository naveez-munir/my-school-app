import { useState, memo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useStudent } from "~/hooks/useStudentQueries";
import { Mail, Phone, User } from "lucide-react";

import { StudentOverview } from './tabs/StudentOverview';
import { StudentPersonalInfo } from './tabs/StudentPersonalInfo';
import { StudentGuardianInfo } from './tabs/StudentGuardianInfo';
import { StudentAcademicInfo } from './tabs/StudentAcademicInfo';
import { StudentDocuments } from './tabs/StudentDocuments';
import { StudentStatus } from './tabs/StudentStatus';
import type { Student } from "~/types/student";
import { getUserId, isAdmin } from "~/utils/auth";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const MemoizedOverview = memo(StudentOverview);
const MemoizedPersonalInfo = memo(StudentPersonalInfo);
const MemoizedGuardianInfo = memo(StudentGuardianInfo);
const MemoizedAcademicInfo = memo(StudentAcademicInfo);
const MemoizedDocuments = memo(StudentDocuments);
const MemoizedStatus = memo(StudentStatus);

const TABS = [
  { name: 'Overview', key: 'overview' },
  { name: 'Personal Info', key: 'personal' },
  { name: 'Guardian', key: 'guardian' },
  { name: 'Academic', key: 'academic' },
  { name: 'Documents', key: 'documents' },
  { name: 'Status', key: 'status' }
];

const TAB_COMPONENTS = [
  { Component: MemoizedOverview, key: 'overview' },
  { Component: MemoizedPersonalInfo, key: 'personal' },
  { Component: MemoizedGuardianInfo, key: 'guardian' },
  { Component: MemoizedAcademicInfo, key: 'academic' },
  { Component: MemoizedDocuments, key: 'documents' },
  { Component: MemoizedStatus, key: 'status' }
];

const StudentAvatar = ({ student }: { student: Student }) => (
  student.photoUrl ? (
    <img
      src={student.photoUrl}
      alt={`${student.firstName} ${student.lastName}`}
      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
    />
  ) : (
    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow">
      <User className="h-10 w-10 text-blue-600" />
    </div>
  )
);

export function StudentDetailPage({stId} : {stId?:string}) {
  const userId = getUserId();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId =  stId ? stId : id ? id : userId
  const { data: student, isLoading } = useStudent(studentId || '');
  const [tabIndex, setTabIndex] = useState(0);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Student not found</h3>
        {isAdmin() && (<div className="mt-4">
          <Link to="/dashboard/students" className="text-blue-600 hover:text-blue-800">
            Back to students list
          </Link>
        </div>)}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Student header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex-shrink-0">
              <StudentAvatar student={student} />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h1>

              <div className="mt-2 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <span className="text-sm font-medium text-gray-500">Roll #:</span>
                    <span className="text-sm text-gray-900">{student.rollNumber || 'Not assigned'}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <span className="text-sm font-medium text-gray-500">Grade:</span>
                    <span className="text-sm text-gray-900">{student.gradeLevel}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' :
                      student.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  {student.cniNumber && (
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <span className="text-sm font-medium text-gray-500">CNI:</span>
                      <span className="text-sm text-gray-900">{student.cniNumber}</span>
                    </div>
                  )}
                  {student.class?.className && (
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <span className="text-sm font-medium text-gray-500">Class:</span>
                      <span className="text-sm text-gray-900">{student.class.className}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  {student.email && (
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{student.email}</span>
                    </div>
                  )}
                  {student.phone && (
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{student.phone}</span>
                    </div>
                  )}
                </div>

                {student.guardian?.name && (
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <span className="text-sm font-medium text-gray-500">Guardian:</span>
                    <span className="text-sm text-gray-900">
                      {student.guardian.name} ({student.guardian.relationship})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isAdmin() && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => navigate('/dashboard/students')}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 transition-colors"
                >
                  Back to List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <TabGroup selectedIndex={tabIndex} onChange={setTabIndex}>
          <TabList className="flex space-x-8 border-b border-gray-200">
            {TABS.map((tab) => (
              <Tab
                key={tab.key}
                className={({ selected }) =>
                  classNames(
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm outline-none',
                    selected
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </TabList>
          
          <TabPanels className="mt-6">
            {TAB_COMPONENTS.map(({ Component }, index) => (
              <TabPanel key={TABS[index].key}>
                <Component student={student} />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
