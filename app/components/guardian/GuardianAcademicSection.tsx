import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useStudent } from '~/hooks/useStudentQueries';
import { useUpcomingExams } from '~/hooks/useExamQueries';
import StudentExamsTable from '~/components/examSection/exams/StudentExamsTable';
import StudentResultDashboard from '~/components/examSection/examResult/StudentResultDashboard';
import { ExamDetailModal } from '~/components/examSection/exams/ExamDetailModal';
import LoadingSpinner from '~/components/common/ui/loader/loading';

interface GuardianAcademicSectionProps {
  studentId: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function GuardianAcademicSection({ studentId }: GuardianAcademicSectionProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>('');

  const { data: student, isLoading: isLoadingStudent, error: studentError } = useStudent(studentId);

  const classId = student?.class?._id || student?.class?.toString() || '';
  const { data: exams = [], isLoading: isLoadingExams, error: examsError } = useUpcomingExams(classId);

  const handleViewExamDetails = (examId: string) => {
    setSelectedExamId(examId);
    setIsExamModalOpen(true);
  };

  const TABS = [
    { name: 'Exams', key: 'exams' },
    { name: 'Results', key: 'results' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-responsive-xl font-bold text-gray-800">Academic Section</h2>
        {student && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Academic information for {student.firstName} {student.lastName}
          </p>
        )}
      </div>

      {/* Student Info Card */}
      {student && (
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h3 className="text-responsive-lg font-semibold text-gray-700 mb-4">Student Information</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500">Class:</span>
              <p className="text-sm font-medium text-gray-900 truncate">
                {typeof student.class === 'object' && student.class !== null
                  ? student.class.className
                  : 'Not assigned'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Roll Number:</span>
              <p className="text-sm font-medium text-gray-900">{student.rollNumber || 'Not assigned'}</p>
            </div>
            <div className="hidden lg:block">
              <span className="text-sm text-gray-500">Grade Level:</span>
              <p className="text-sm font-medium text-gray-900">
                {typeof student.class === 'object' && student.class !== null
                  ? student.class.classGradeLevel
                  : 'Not assigned'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
          <TabList className="flex space-x-8 border-b border-gray-200 px-6">
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

          <TabPanels className="p-1 lg:p-6">
            {/* Exams Tab */}
            <TabPanel>
              {isLoadingStudent || isLoadingExams ? (
                <LoadingSpinner />
              ) : studentError ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  Error loading student: {(studentError as Error).message}
                </div>
              ) : examsError ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  Error loading exams: {(examsError as Error).message}
                </div>
              ) : !classId ? (
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                  Student is not assigned to any class yet.
                </div>
              ) : exams.length === 0 ? (
                <div className="bg-gray-50 p-8 text-center text-gray-500 rounded-lg">
                  No upcoming exams found for this class.
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h3 className="text-responsive-lg font-semibold text-gray-700">Upcoming Exams</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Exams scheduled for {typeof student.class === 'object' && student.class !== null
                        ? student.class.className
                        : 'this class'}
                    </p>
                  </div>
                  <StudentExamsTable
                    data={exams}
                    onViewDetails={handleViewExamDetails}
                  />
                </div>
              )}
            </TabPanel>

            {/* Results Tab */}
            <TabPanel>
              {isLoadingStudent ? (
                <LoadingSpinner />
              ) : studentError ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  Error loading student: {(studentError as Error).message}
                </div>
              ) : (
                <StudentResultDashboard studentId={studentId} />
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {selectedExamId && (
        <ExamDetailModal
          isOpen={isExamModalOpen}
          onClose={() => {
            setIsExamModalOpen(false);
            setSelectedExamId('');
          }}
          examId={selectedExamId}
        />
      )}
    </div>
  );
}

