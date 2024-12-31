import { useNavigate } from 'react-router';
import { BatchAttendanceForm } from '~/components/attendance/BatchAttendanceForm';
import { useCreateBatchAttendance } from '~/hooks/useAttendanceQueries';
import { useStudents } from '~/hooks/useStudentQueries';
import { useTeachers } from '~/hooks/useTeacherQueries';
import { useStaffList } from '~/hooks/useStaffQueries';
import { useClasses } from '~/hooks/useClassQueries';
import { AttendanceType, type BatchAttendanceInput } from '~/types/attendance';
import type { Route } from "../+types";
import toast from 'react-hot-toast';
import { getUserFriendlyErrorMessage } from '~/utils/error';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Batch Attendance" },
    { name: "description", content: "Mark attendance for multiple users at once" },
  ];
}

export default function BatchAttendance() {
  const navigate = useNavigate();
  const createBatchAttendanceMutation = useCreateBatchAttendance();

  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  const { data: staff = [] } = useStaffList();
  const { data: classes = [] } = useClasses();

  const allUsers = [
    ...students.map(student => ({
      id: student.id,
      name: student.name,
      type: AttendanceType.STUDENT,
      rollNumber: student.rollNumber,
      employeeId: undefined,
      photoUrl: student.photoUrl,
      classId: student.classId
    })),
    ...teachers.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      type: AttendanceType.TEACHER,
      rollNumber: undefined,
      employeeId: teacher.cniNumber,
      photoUrl: teacher.photoUrl
    })),
    ...staff.map(staffMember => ({
      id: staffMember.id,
      name: staffMember.name,
      type: AttendanceType.STAFF,
      rollNumber: undefined,
      employeeId: staffMember.designation,
      photoUrl: staffMember.photoUrl
    }))
  ];

  const classOptions = classes.map(cls => ({
    id: cls.id,
    className: cls.className,
    section: cls.classSection
  }));

  const handleSubmit = (data: BatchAttendanceInput) => {
    createBatchAttendanceMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Batch attendance created successfully');
        navigate('/dashboard/attendance');
      },
      onError: (error) => {
        const errorMessage = getUserFriendlyErrorMessage(error, allUsers);
        toast.error(errorMessage);
        console.error('Failed to create batch attendance:', error);
      }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/attendance');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Batch Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">
          Mark attendance for multiple students, teachers, or staff members at once
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <BatchAttendanceForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            users={allUsers}
            classes={classOptions}
            isLoading={createBatchAttendanceMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
