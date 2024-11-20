import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, GraduationCap, BookOpen, BarChart3, RefreshCw, UserCheck, DollarSign, FileText, Calendar } from 'lucide-react';
import { SummaryCard } from './shared/SummaryCard';
import { AttendanceSummaryCard } from './shared/AttendanceSummaryCard';
import { FinancialSummaryCard } from './shared/FinancialSummaryCard';
import { PendingActionsCard } from './shared/PendingActionsCard';
import { QuickLinksCard } from './shared/QuickLinksCard';
import { RecentActivityCard, type Activity } from './shared/RecentActivityCard';
import { AttendanceTrendChart } from './charts/AttendanceTrendChart';
import { StudentDistributionChart } from './charts/StudentDistributionChart';
import { FeeCollectionChart } from './charts/FeeCollectionChart';
import { useStudents } from '~/hooks/useStudentQueries';
import { useTeachers } from '~/hooks/useTeacherQueries';
import { useStaffList } from '~/hooks/useStaffQueries';
import { useClasses } from '~/hooks/useClassQueries';
import { useMonthlyAttendanceReport } from '~/hooks/useAttendanceQueries';
import { usePendingLeaves } from '~/hooks/useStudentLeaveQueries';
import { useLeaves } from '~/hooks/staffLeaveQueries';
import { usePaymentStats } from '~/hooks/useFeePaymentQueries';
import { useAcademicYears } from '~/hooks/useAcademicYearQueries';
import { AttendanceType } from '~/types/attendance';
import { subDays, format, startOfDay } from 'date-fns';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { data: academicYears = [] } = useAcademicYears();
  const activeYear = academicYears.find(ay => ay.isActive);

  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  const { data: staff = [], isLoading: staffLoading } = useStaffList();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  
  const { data: attendanceReport, isLoading: attendanceLoading } = useMonthlyAttendanceReport({
    month: currentMonth,
    year: currentYear,
    userType: AttendanceType.STUDENT
  });

  const { data: studentLeaves = [], isLoading: studentLeavesLoading } = usePendingLeaves();
  const { data: staffLeaves = [], isLoading: staffLeavesLoading } = useLeaves({ status: 'PENDING' });
  
  const { data: feeStats, isLoading: feeStatsLoading } = usePaymentStats(
    activeYear?.displayName || currentYear.toString()
  );

  const todayAttendance = useMemo(() => {
    if (!attendanceReport?.dailyReport) {
      return { present: 0, absent: 0, late: 0, leave: 0, total: 0 };
    }

    const dayOfMonth = currentDate.getDate();
    const todayData = attendanceReport.dailyReport[dayOfMonth];

    if (!todayData) {
      return { present: 0, absent: 0, late: 0, leave: 0, total: 0 };
    }

    return {
      present: todayData.present || 0,
      absent: todayData.absent || 0,
      late: todayData.late || 0,
      leave: 0,
      total: todayData.total || 0
    };
  }, [attendanceReport, currentDate]);

  const attendancePercentage = useMemo(() => {
    if (todayAttendance.total === 0) return '0.0';
    return ((todayAttendance.present / todayAttendance.total) * 100).toFixed(1);
  }, [todayAttendance]);

  const currentMonthRevenue = useMemo(() => {
    if (!feeStats?.byMonth) return 0;
    return feeStats.byMonth[currentMonth] || 0;
  }, [feeStats, currentMonth]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload();
  };

  const pendingActions = [
    {
      label: 'Student Leave Requests',
      count: studentLeaves.length || 0,
      onClick: () => navigate('/dashboard/leave/student/pending'),
      icon: 'clock' as const
    },
    {
      label: 'Staff Leave Requests',
      count: staffLeaves.length || 0,
      onClick: () => navigate('/dashboard/leave/staff'),
      icon: 'clock' as const
    },
    {
      label: 'Overdue Fees',
      count: 0,
      onClick: () => navigate('/dashboard/fee/student-fee'),
      icon: 'alert' as const
    }
  ];

  const quickLinks = [
    {
      label: 'Mark Attendance',
      icon: UserCheck,
      onClick: () => navigate('/dashboard/attendance'),
      color: 'text-green-600'
    },
    {
      label: 'Fee Collection',
      icon: DollarSign,
      onClick: () => navigate('/dashboard/fee/payment'),
      color: 'text-indigo-600'
    },
    {
      label: 'View Reports',
      icon: FileText,
      onClick: () => navigate('/dashboard/attendance'),
      color: 'text-blue-600'
    },
    {
      label: 'Timetable',
      icon: Calendar,
      onClick: () => navigate('/dashboard/timetable'),
      color: 'text-purple-600'
    }
  ];

  const attendanceTrendData = useMemo(() => {
    if (!attendanceReport?.dailyReport) {
      return [];
    }

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayOfMonth = date.getDate();
      const dayData = attendanceReport.dailyReport[dayOfMonth];

      if (!dayData) {
        return {
          date: format(date, 'yyyy-MM-dd'),
          present: 0,
          absent: 0,
          total: 0,
          percentage: 0
        };
      }

      return {
        date: format(date, 'yyyy-MM-dd'),
        present: dayData.present || 0,
        absent: dayData.absent || 0,
        total: dayData.total || 0,
        percentage: dayData.total > 0 ? (dayData.present / dayData.total) * 100 : 0
      };
    });

    return last7Days;
  }, [attendanceReport]);

  const studentDistributionData = useMemo(() => {
    const classGroups = students.reduce((acc, student) => {
      const className = student.class?.name || 'Unassigned';
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(classGroups).map(([name, value], index) => ({
      name,
      value,
      id: `class-${name}-${index}`
    }));
  }, [students]);

  const feeCollectionData = useMemo(() => {
    if (!feeStats?.byMonth) return [];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 6 + i + 12) % 12;
      const month = monthIndex === 0 ? 12 : monthIndex;
      return {
        month: monthNames[month - 1],
        collected: feeStats.byMonth[month] || 0,
        pending: 0
      };
    });

    return last6Months;
  }, [feeStats, currentMonth]);

  const recentActivities = useMemo((): Activity[] => {
    const activities: Activity[] = [];

    studentLeaves.slice(0, 5).forEach(leave => {
      activities.push({
        id: `leave-${leave._id}`,
        type: 'leave_request',
        description: `Leave request - ${leave.student?.firstName || 'Student'} - ${leave.leaveType}`,
        timestamp: leave.createdAt || new Date()
      });
    });

    return activities.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [studentLeaves]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome, Admin!</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Students"
          value={students.length}
          icon={Users}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
          iconColor="text-blue-600"
          subtitle="Active students"
          onClick={() => navigate('/dashboard/students')}
          isLoading={studentsLoading}
        />

        <SummaryCard
          title="Total Teachers"
          value={teachers.length}
          icon={GraduationCap}
          bgColor="bg-green-50"
          textColor="text-green-600"
          iconColor="text-green-600"
          subtitle="Teaching staff"
          onClick={() => navigate('/dashboard/teachers')}
          isLoading={teachersLoading}
        />

        <SummaryCard
          title="Total Classes"
          value={classes.length}
          icon={BookOpen}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
          iconColor="text-purple-600"
          subtitle="Active classes"
          onClick={() => navigate('/dashboard/classes')}
          isLoading={classesLoading}
        />

        <SummaryCard
          title="Today's Attendance"
          value={`${attendancePercentage}%`}
          icon={BarChart3}
          bgColor="bg-orange-50"
          textColor="text-orange-600"
          iconColor="text-orange-600"
          subtitle={`${todayAttendance.present} present`}
          onClick={() => navigate('/dashboard/attendance')}
          isLoading={attendanceLoading}
        />
      </div>

      <AttendanceTrendChart
        data={attendanceTrendData}
        isLoading={studentsLoading}
        userType="Student"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceSummaryCard
          present={todayAttendance.present}
          absent={todayAttendance.absent}
          late={todayAttendance.late}
          leave={todayAttendance.leave}
          total={todayAttendance.total}
          onViewDetails={() => navigate('/dashboard/attendance')}
          isLoading={attendanceLoading}
        />

        <FinancialSummaryCard
          monthlyRevenue={currentMonthRevenue}
          pendingAmount={feeStats?.pendingAmount || 0}
          collectionRate={feeStats?.collectionRate || 0}
          onViewDetails={() => navigate('/dashboard/fee/payment')}
          isLoading={feeStatsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentDistributionChart
          data={studentDistributionData}
          isLoading={studentsLoading}
        />

        <FeeCollectionChart
          data={feeCollectionData}
          isLoading={feeStatsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingActionsCard
          actions={pendingActions}
          isLoading={studentLeavesLoading || staffLeavesLoading}
        />

        <RecentActivityCard
          activities={recentActivities}
          isLoading={studentsLoading || studentLeavesLoading}
          maxItems={5}
        />
      </div>

      <QuickLinksCard links={quickLinks} />
    </div>
  );
}

