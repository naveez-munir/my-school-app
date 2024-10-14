import type { Route } from "./+types";
import { useEffect, useState } from 'react';
import { getUserRole } from '~/utils/auth';
import { UserRoleEnum } from '~/types/user';
import { StudentScheduleView } from '~/components/timetable/schedules/StudentScheduleView';
import { TeacherScheduleView } from '~/components/timetable/schedules/TeacherScheduleView';
import { GuardianScheduleView } from '~/components/timetable/schedules/GuardianScheduleView';
import { PrincipalDashboard } from '~/components/dashboard/PrincipalDashboard';
import { AdminDashboard } from '~/components/dashboard/AdminDashboard';
import { useMySchedule } from '~/hooks/useScheduleQueries';
import { useAcademicYears } from '~/hooks/useAcademicYearQueries';
import type { GuardianSchedule } from '~/types/timetable';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Overview" },
    { name: "description", content: "Dashboard overview page" },
  ];
}

export default function DashboardIndex() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { data: academicYears = [] } = useAcademicYears();

  const activeYear = academicYears.find(ay => ay.isActive);

  // Only fetch schedule for users who have schedules (not admin)
  const userRoleData = getUserRole();
  const shouldFetchSchedule = !!userRoleData?.role && [
    UserRoleEnum.STUDENT,
    UserRoleEnum.TEACHER,
    UserRoleEnum.GUARDIAN,
    UserRoleEnum.PARENT
  ].includes(userRoleData.role as UserRoleEnum);

  const { data: scheduleData, isLoading } = useMySchedule(undefined, {
    enabled: shouldFetchSchedule
  });

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role?.role as string);
  }, []);

  if (userRole === UserRoleEnum.STUDENT) {
    return (
      <div className="space-y-6">
        <div className="text-gray-700">
          <h2 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h2>
          <p className="text-gray-600">View your weekly class schedule below</p>
        </div>
        <StudentScheduleView
          schedule={(scheduleData as any)?.schedule || []}
          studentName={(scheduleData as any)?.studentName}
          className={(scheduleData as any)?.className}
          academicYear={activeYear?.displayName}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (userRole === UserRoleEnum.TEACHER) {
    return (
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        <div className="text-gray-700">
          <h2 className="text-responsive-xl font-bold mb-2">Welcome to your Dashboard</h2>
          <p className="text-xs lg:text-sm text-gray-600">Your teaching schedule for this week</p>
        </div>
        <TeacherScheduleView
          schedule={(scheduleData as any)?.schedule || []}
          teacherName={(scheduleData as any)?.teacherName}
          academicYear={activeYear?.displayName}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (userRole === UserRoleEnum.GUARDIAN || userRole === UserRoleEnum.PARENT) {
    const guardianData = scheduleData as GuardianSchedule;

    return (
      <div className="space-y-6">
        <div className="text-gray-700">
          <h2 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h2>
          <p className="text-gray-600">View your children's schedules below</p>
        </div>
        <GuardianScheduleView
          students={guardianData?.children?.map(child => ({
            id: child.studentId,
            name: child.studentName,
            className: child.className,
            schedule: child.schedule
          })) || []}
          guardianName={guardianData?.guardianName}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (userRole === UserRoleEnum.PRINCIPAL) {
    return <PrincipalDashboard />;
  }

  if (
    userRole === UserRoleEnum.ADMIN ||
    userRole === UserRoleEnum.TENANT_ADMIN
  ) {
    return <AdminDashboard />;
  }

  return (
    <div className="text-gray-700">
      <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Admin dashboard widgets */}
      </div>
    </div>
  );
}
