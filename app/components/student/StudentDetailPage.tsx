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
      className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full object-cover border-4 border-white shadow"
    />
  ) : (
    <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow">
      <User className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-blue-600" />
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
        <h3 className="text-heading">Student not found</h3>
        {isAdmin() && (<div className="mt-4">
          <Link to="/dashboard/students" className="text-blue-600 hover:text-blue-800">
            Back to students list
          </Link>
        </div>)}
      </div>
    );
  }

  return (
    <div className="">
      {/* Student header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-3 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex flex-row items-start gap-3 sm:gap-6">
            <div className="flex-shrink-0">
              <StudentAvatar student={student} />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-responsive-xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h1>

              <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-label">Roll #:</span>
                    <span className="text-body">{student.rollNumber || 'Not assigned'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-label">Grade:</span>
                    <span className="text-body">{student.gradeLevel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-label">Status:</span>
                    <span className={`text-responsive px-2 py-0.5 rounded-full ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' :
                      student.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-0.5">
                  {student.cniNumber && (
                    <div className="flex items-center gap-1">
                      <span className="text-label">CNI:</span>
                      <span className="text-body">{student.cniNumber}</span>
                    </div>
                  )}
                  {student.class?.className && (
                    <div className="flex items-center gap-1">
                      <span className="text-label">Class:</span>
                      <span className="text-body">{student.class.className}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-0.5">
                  {student.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="icon-md text-gray-500" />
                      <span className="text-body truncate max-w-[200px] sm:max-w-none">{student.email}</span>
                    </div>
                  )}
                  {student.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="icon-md text-gray-500" />
                      <span className="text-body">{student.phone}</span>
                    </div>
                  )}
                </div>

                {student.guardian?.name && (
                  <div className="flex items-center gap-1">
                    <span className="text-label">Guardian:</span>
                    <span className="text-body">
                      {student.guardian.name} ({student.guardian.relationship})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isAdmin() && (
              <div className="flex-shrink-0 hidden sm:block">
                <button
                  onClick={() => navigate('/dashboard/students')}
                  className="btn-secondary transition-colors"
                >
                  Back to List
                </button>
              </div>
            )}
          </div>

          {/* Mobile Back Button */}
          {isAdmin() && (
            <div className="mt-3 sm:hidden">
              <button
                onClick={() => navigate('/dashboard/students')}
                className="btn-secondary w-full"
              >
                Back to List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 sm:mt-6 lg:mt-8">
        <TabGroup selectedIndex={tabIndex} onChange={setTabIndex}>
          <TabList className="flex space-x-4 sm:space-x-6 lg:space-x-8 border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => (
              <Tab
                key={tab.key}
                className={({ selected }) =>
                  classNames(
                    'whitespace-nowrap py-2 sm:py-3 lg:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm outline-none',
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

          <TabPanels className="mt-4 sm:mt-6">
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
