import { GraduationCap } from 'lucide-react';
import type { ClassResponse } from '~/types/class';

interface Props {
  classData: ClassResponse;
  onMarkAttendance: () => void;
}

export function ClassHeaderCard({ classData, onMarkAttendance }: Props) {
  const isTemporary = !!classData.tempTeacherName && !classData.teacherName;
  const teacherName = classData.teacherName || classData.tempTeacherName;

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-gray-600 flex-shrink-0" />
            <div>
              <h1 className="text-responsive-xl font-bold tracking-tight text-gray-700">
                {classData.className}
              </h1>
              {teacherName && (
                <p className="text-gray-500 text-xs lg:text-sm mt-1">
                  {teacherName}
                  {isTemporary && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                      Temporary
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onMarkAttendance}
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ✓ Mark Attendance
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
            <div className="text-gray-500 text-xs mb-1">Grade Level</div>
            <div className="text-sm sm:text-base lg:text-xl font-semibold text-gray-700">{classData.classGradeLevel}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
            <div className="text-gray-500 text-xs mb-1">Section</div>
            <div className="text-sm sm:text-base lg:text-xl font-semibold text-gray-700">{classData.classSection}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
            <div className="text-gray-500 text-xs mb-1">Subjects</div>
            <div className="text-sm sm:text-base lg:text-xl font-semibold text-gray-700">{classData.subjectCount}</div>
          </div>
        </div>
    </div>
  );
}
