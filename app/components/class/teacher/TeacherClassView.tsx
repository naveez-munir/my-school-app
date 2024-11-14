import { useState } from 'react';
import { useClasses } from '~/hooks/useClassQueries';
import { useClassAttendanceReport, useCreateBatchAttendance } from '~/hooks/useAttendanceQueries';
import { useSearchStudents } from '~/hooks/useStudentQueries';
import { ClassHeaderCard } from './ClassHeaderCard';
import { ClassStudentsList } from './ClassStudentsList';
import { NoClassAssigned } from './NoClassAssigned';
import { ClassesSkeleton } from '../ClassesSkeleton';
import { ClassAttendanceRecordsTable } from '~/components/attendance/ClassAttendanceRecordsTable';
import { BatchAttendanceForm } from '~/components/attendance/BatchAttendanceForm';
import { AttendanceType, type BatchAttendanceInput } from '~/types/attendance';
import toast from 'react-hot-toast';
import { getErrorMessage } from '~/utils/error';

export function TeacherClassView() {
  const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);
  const [showBatchAttendance, setShowBatchAttendance] = useState(false);
  const { data: classes, isLoading, error } = useClasses();

  const myClass = classes?.[0];

  const { data: students = [] } = useSearchStudents(
    myClass ? {
      gradeLevel: myClass.classGradeLevel,
      section: myClass.classSection
    } : undefined
  );

  const createBatchAttendanceMutation = useCreateBatchAttendance();

  const { data: attendanceReport } = useClassAttendanceReport(
    myClass?.id || '',
    undefined,
    { enabled: !!myClass?.id && showAttendanceHistory }
  );

  const users = students.map(student => ({
    id: student.id,
    name: student.name,
    type: AttendanceType.STUDENT,
    rollNumber: student.rollNumber,
    employeeId: undefined,
    photoUrl: student.photoUrl,
    classId: student.classId
  }));

  const classOptions = myClass ? [{
    id: myClass.id,
    className: myClass.className,
    section: myClass.classSection
  }] : [];

  const handleBatchSubmit = (data: BatchAttendanceInput) => {
    createBatchAttendanceMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Batch attendance created successfully');
        setShowBatchAttendance(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const handleOpenBatchAttendance = () => {
    setShowBatchAttendance(true);
  };

  if (isLoading) {
    return <ClassesSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Error loading class information
        </div>
        <p className="text-gray-600 text-sm">
          {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!classes || classes.length === 0 || !myClass) {
    return <NoClassAssigned />;
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <ClassHeaderCard
        classData={myClass}
        onMarkAttendance={handleOpenBatchAttendance}
      />
      <ClassStudentsList classId={myClass.id} className={myClass.className} />

      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
        <button
          onClick={() => setShowAttendanceHistory(!showAttendanceHistory)}
          className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
        >
          {showAttendanceHistory ? '▼ Hide' : '▶ Show'} Attendance History
        </button>
      </div>

      {showAttendanceHistory && attendanceReport && (
        <ClassAttendanceRecordsTable records={attendanceReport.records || []} />
      )}

      {showBatchAttendance && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <BatchAttendanceForm
              onSubmit={handleBatchSubmit}
              onCancel={() => setShowBatchAttendance(false)}
              users={users}
              classes={classOptions}
              isLoading={createBatchAttendanceMutation.isPending}
              initialUserType={AttendanceType.STUDENT}
              initialClassId={myClass.id}
              hideUserTypeSelector={true}
              hideClassSelector={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
