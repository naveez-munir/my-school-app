import { useState } from 'react';
import { useClassAttendanceReport, useUserAttendanceReport, useMonthlyAttendanceReport } from '~/hooks/useAttendanceQueries';
import { AttendanceType, type ClassAttendanceFilter, type UserAttendanceFilter, type MonthlyReportFilter } from '~/types/attendance';
import { SelectInput } from '../common/form/inputs/SelectInput';
import { DateInput } from '../common/form/inputs/DateInput';
import { TextInput } from '../common/form/inputs/TextInput';
import { ClassSelector } from '../common/ClassSelector';
import { TeacherSelector } from '../common/TeacherSelector';
import { StudentSelector } from '../common/StudentSelector';
import { StaffSelector } from '../common/StaffSelector';
import { UserReportHeader } from './UserReportHeader';
import { AttendanceSummaryCards } from './AttendanceSummaryCards';
import { AttendanceRecordsTable } from './AttendanceRecordsTable';
import { ClassReportHeader } from './ClassReportHeader';
import { ClassAttendanceRecordsTable } from './ClassAttendanceRecordsTable';
import { MonthlyReportHeader } from './MonthlyReportHeader';
import { MonthlyDailyBreakdownTable } from './MonthlyDailyBreakdownTable';
import { BarChart3 } from 'lucide-react';

type ReportType = 'class' | 'user' | 'monthly';

export function AttendanceReports() {
  const [reportType, setReportType] = useState<ReportType>('class');
  const [classId, setClassId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userType, setUserType] = useState<AttendanceType>(AttendanceType.STUDENT);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const reportTypeMap: Record<string, ReportType> = {
    'Class Report': 'class',
    'User Report': 'user',
    'Monthly Report': 'monthly'
  };

  const classFilter: ClassAttendanceFilter = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate })
  };

  const userFilter: UserAttendanceFilter = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    userType
  };

  const monthlyFilter: MonthlyReportFilter = {
    month,
    year,
    userType,
    ...(classId && { classId })
  };

  const classReport = useClassAttendanceReport(classId, classFilter, { enabled: reportType === 'class' && !!classId });
  const userReport = useUserAttendanceReport(userId, userFilter, { enabled: reportType === 'user' && !!userId });
  const monthlyReport = useMonthlyAttendanceReport(monthlyFilter, { enabled: reportType === 'monthly' });

  const renderSummaryCard = (title: string, summary: any) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{summary.present || 0}</div>
          <div className="text-sm text-gray-600">Present</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{summary.absent || 0}</div>
          <div className="text-sm text-gray-600">Absent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{summary.late || 0}</div>
          <div className="text-sm text-gray-600">Late</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.total || 0}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>
      {summary.presentPercentage && (
        <div className="mt-4 text-center">
          <div className="text-xl font-semibold text-indigo-600">
            {summary.presentPercentage.toFixed(1)}% Attendance
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendance Reports</h1>
          <p className="text-gray-600">Generate and view attendance analytics</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          onClick={() => window.print()}
        >
          <BarChart3 className="h-5 w-5" />
          Export Report
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Report Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SelectInput
            label="Report Type"
            value={reportType}
            onChange={(value) => setReportType(reportTypeMap[value] || value as ReportType)}
            options={{ class: 'Class Report', user: 'User Report', monthly: 'Monthly Report' }}
          />

          <SelectInput<typeof AttendanceType>
            label="User Type"
            value={userType}
            onChange={(value) => setUserType(value as AttendanceType)}
            options={AttendanceType}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {reportType === 'class' && (
            <ClassSelector
              value={classId}
              onChange={setClassId}
              required
            />
          )}

          {reportType === 'user' && userType === AttendanceType.STUDENT && (
            <StudentSelector
              value={userId}
              onChange={setUserId}
              required
            />
          )}

          {reportType === 'user' && userType === AttendanceType.TEACHER && (
            <TeacherSelector
              value={userId}
              onChange={setUserId}
              required
            />
          )}

          {reportType === 'user' && userType === AttendanceType.STAFF && (
            <StaffSelector
              value={userId}
              onChange={setUserId}
              required
            />
          )}

          {reportType === 'monthly' && userType === AttendanceType.STUDENT && (
            <ClassSelector
              value={classId}
              onChange={setClassId}
              label="Class (Optional)"
            />
          )}
        </div>

        {reportType !== 'monthly' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              placeholder="From"
            />
            <DateInput
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              placeholder="To"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="Month"
              value={month}
              onChange={(value) => setMonth(Number(value))}
              options={{
                1: 'January', 2: 'February', 3: 'March', 4: 'April',
                5: 'May', 6: 'June', 7: 'July', 8: 'August',
                9: 'September', 10: 'October', 11: 'November', 12: 'December'
              }}
            />
            <TextInput
              label="Year"
              value={year.toString()}
              onChange={(value) => setYear(Number(value))}
              placeholder="Enter year"
              type="number"
            />
          </div>
        )}
      </div>

      {/* Report Results */}
      <div className="space-y-6">
        {reportType === 'class' && classReport.data && classReport.data.class && (
          <div className="space-y-6">
            {/* Class Report Header with Distribution */}
            <ClassReportHeader
              classInfo={classReport.data.class}
              summary={classReport.data.summary}
              dateRange={classReport.data.dateRange}
              totalStudents={classReport.data.records?.length}
            />

            {/* Summary Cards */}
            <AttendanceSummaryCards summary={classReport.data.summary} />

            {/* Detailed Records Table with Grouping */}
            <ClassAttendanceRecordsTable records={classReport.data.records || []} />
          </div>
        )}

        {reportType === 'user' && userReport.data && (
          <div className="space-y-6">
            {/* User Report Header with Progress Bars */}
            <UserReportHeader
              user={userReport.data.user}
              summary={userReport.data.summary}
            />

            {/* Summary Cards */}
            <AttendanceSummaryCards summary={userReport.data.summary} />

            {/* Detailed Records Table */}
            <AttendanceRecordsTable records={userReport.data.records} />
          </div>
        )}

        {reportType === 'monthly' && monthlyReport.data && (
          <div className="space-y-6">
            <MonthlyReportHeader
              month={monthlyReport.data.month}
              year={monthlyReport.data.year}
              userType={monthlyReport.data.filter?.userType}
              classInfo={monthlyReport.data.filter?.class}
              averageAttendance={monthlyReport.data.summary.presentPercentage || 0}
            />

            <AttendanceSummaryCards summary={monthlyReport.data.summary} />

            <MonthlyDailyBreakdownTable
              dailyReport={monthlyReport.data.dailyReport}
              month={monthlyReport.data.month}
              year={monthlyReport.data.year}
            />
          </div>
        )}

        {((reportType === 'class' && classReport.isLoading) ||
          (reportType === 'user' && userReport.isLoading) ||
          (reportType === 'monthly' && monthlyReport.isLoading)) && (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report...</p>
          </div>
        )}

        {((reportType === 'class' && classReport.isError) ||
          (reportType === 'user' && userReport.isError) ||
          (reportType === 'monthly' && monthlyReport.isError)) && (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-red-600">Failed to load report. Please check your parameters and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
