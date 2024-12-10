import { useMemo, useState } from 'react';
import { ScheduleGrid } from './ScheduleGrid';
import { Calendar, Users, BookOpen, Clock, GraduationCap } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  className: string;
  schedule: any[];
}

interface GuardianScheduleViewProps {
  students: Student[];
  guardianName?: string;
  isLoading?: boolean;
}

export function GuardianScheduleView({
  students,
  guardianName,
  isLoading
}: GuardianScheduleViewProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students.length > 0 ? students[0].id : ''
  );

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const selectedSchedule = useMemo(() => {
    if (!selectedStudent?.schedule) return [];
    return selectedStudent.schedule.filter((slot: any) => !slot.isBreak);
  }, [selectedStudent]);

  const stats = useMemo(() => {
    if (!selectedSchedule || selectedSchedule.length === 0) {
      return {
        totalSubjects: 0,
        totalTeachers: 0,
        totalPeriods: 0,
        activeDays: 0,
        dailyBreakdown: {},
        subjectDistribution: {},
        teacherList: {}
      };
    }

    const uniqueSubjects = new Set(selectedSchedule.map((s: any) => s.subjectName)).size;
    const uniqueTeachers = new Set(selectedSchedule.map((s: any) => s.teacherName)).size;
    const totalPeriods = selectedSchedule.length;
    const activeDays = new Set(selectedSchedule.map((s: any) => s.dayOfWeek)).size;

    // Daily breakdown
    const dailyBreakdown = selectedSchedule.reduce((acc: any, slot: any) => {
      const day = slot.dayName || `Day ${slot.dayOfWeek}`;
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    // Subject distribution
    const subjectDistribution = selectedSchedule.reduce((acc: any, slot: any) => {
      const subject = slot.subjectName || 'Unknown';
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {});

    // Teacher list with subjects
    const teacherList = selectedSchedule.reduce((acc: any, slot: any) => {
      const teacher = slot.teacherName || 'Unknown';
      const subject = slot.subjectName || 'Unknown';

      if (!acc[teacher]) {
        acc[teacher] = { subjects: new Set(), count: 0 };
      }
      acc[teacher].subjects.add(subject);
      acc[teacher].count += 1;

      return acc;
    }, {});

    // Convert Set to Array for rendering
    Object.keys(teacherList).forEach(teacher => {
      teacherList[teacher].subjects = Array.from(teacherList[teacher].subjects);
    });

    return {
      totalSubjects: uniqueSubjects,
      totalTeachers: uniqueTeachers,
      totalPeriods,
      activeDays,
      dailyBreakdown,
      subjectDistribution,
      teacherList
    };
  }, [selectedSchedule]);

  const childrenSummary = useMemo(() => {
    return students.map(student => ({
      id: student.id,
      name: student.name,
      className: student.className,
      totalClasses: student.schedule?.filter((s: any) => !s.isBreak).length || 0
    }));
  }, [students]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No students found under your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Children's Schedule</h2>
            </div>
            {guardianName && (
              <p className="text-sm text-gray-600 mt-1">Guardian: {guardianName}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{students.length} {students.length === 1 ? 'Child' : 'Children'}</span>
          </div>
        </div>

        {/* Multi-Child Summary */}
        {students.length > 1 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-900 uppercase mb-3">All Children Overview</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {childrenSummary.map(child => (
                <div
                  key={child.id}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedStudentId === child.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-800 text-sm">{child.name}</p>
                  <p className="text-xs text-gray-600">{child.className}</p>
                  <p className="text-xs text-gray-500 mt-1">{child.totalClasses} classes/week</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Child Selector */}
        {students.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child to View Schedule*
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.className}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedStudent && (
        <>
          {/* Currently Viewing Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Currently Viewing</p>
            <p className="text-lg font-bold text-blue-900">{selectedStudent.name}</p>
            <p className="text-sm text-blue-700">{selectedStudent.className}</p>
          </div>

          {/* Statistics Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Subjects</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalSubjects}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Teachers</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{stats.totalTeachers}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Periods/Week</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{stats.totalPeriods}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Active Days</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{stats.activeDays}</p>
              </div>
            </div>

            {/* Daily Breakdown */}
            {Object.keys(stats.dailyBreakdown).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-600 uppercase mb-2">Daily Breakdown</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.dailyBreakdown).map(([day, count]) => (
                    <div key={day} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium text-gray-700">{day}:</span>{' '}
                      <span className="text-gray-600">{count} periods</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subject Distribution */}
          {Object.keys(stats.subjectDistribution).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Subject Distribution</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(stats.subjectDistribution)
                  .sort(([, a]: any, [, b]: any) => b - a)
                  .map(([subject, count]) => (
                    <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{subject}</span>
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        {count} {count === 1 ? 'period' : 'periods'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Teacher Information */}
          {Object.keys(stats.teacherList).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Teachers</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(stats.teacherList)
                  .sort(([, a]: any, [, b]: any) => b.count - a.count)
                  .map(([teacher, data]: any) => (
                    <div key={teacher} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800">{teacher}</span>
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                          {data.count} {data.count === 1 ? 'period' : 'periods'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {data.subjects.join(', ')}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Schedule Grid */}
          <ScheduleGrid
            schedule={selectedSchedule}
            showTeacher={true}
            showClass={false}
            emptyMessage={`No schedule available for ${selectedStudent.name}.`}
          />

          {/* Info Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-900">
                <p className="font-semibold mb-1">Stay Informed</p>
                <p className="text-green-800">
                  This schedule is updated automatically. Any teacher substitutions or schedule
                  changes will appear here. Check back regularly for updates.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
