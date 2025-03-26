import { useState, memo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useStudent } from "~/hooks/useStudentQueries";

import { StudentOverview } from './tabs/StudentOverview';
import { StudentPersonalInfo } from './tabs/StudentPersonalInfo';
import { StudentGuardianInfo } from './tabs/StudentGuardianInfo';
import { StudentAcademicInfo } from './tabs/StudentAcademicInfo';
import { StudentDocuments } from './tabs/StudentDocuments';
import { StudentStatus } from './tabs/StudentStatus';
import type { Student } from "~/types/student";

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
      className="h-16 w-16 rounded-full object-cover mr-4" 
    />
  ) : (
    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
      <span className="text-gray-500 text-xl font-medium">
        {student.firstName?.[0]}{student.lastName?.[0]}
      </span>
    </div>
  )
);

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading } = useStudent(id || '');
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
        <div className="mt-4">
          <Link to="/dashboard/students" className="text-blue-600 hover:text-blue-800">
            Back to students list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Student header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <StudentAvatar student={student} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-sm text-gray-500">
              Grade: {student.gradeLevel} • Roll #: {student.rollNumber || 'Not assigned'} • 
              Status: <span className={student.status === 'Active' ? 'text-green-600' : 'text-red-600'}>
                {student.status}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            onClick={() => navigate('/dashboard/students')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to List
          </button>
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
