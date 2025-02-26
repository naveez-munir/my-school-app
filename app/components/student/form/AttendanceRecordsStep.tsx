import { useState, useEffect } from 'react';
import type { CreateStudentDto } from '~/types/student';

interface AttendanceRecordProps {
  data: Partial<CreateStudentDto>;
  onBack: () => void;
  studentId?: string;
}

// In a real application, you would fetch this data from an API
interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remark?: string;
}

export function AttendanceRecordsStep({ data, onBack, studentId }: AttendanceRecordProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    percentage: 0
  });

  // Mock data for demonstration purposes
  // useEffect(() => {
  //   // Simulate API call to fetch attendance records
  //   const fetchAttendance = async () => {
  //     try {
  //       setLoading(true);
  //       // In a real app, you would make an API call here
  //       // const response = await api.get(`/students/${studentId}/attendance`);
        
  //       // Mock data for demonstration
  //       const mockRecords: AttendanceRecord[] = [
  //         { date: '2025-02-24', status: 'Present' },
  //         { date: '2025-02-23', status: 'Present' },
  //         { date: '2025-02-22', status: 'Absent', remark: 'Sick leave' },
  //         { date: '2025-02-21', status: 'Present' },
  //         { date: '2025-02-20', status: 'Late', remark: 'Traffic delay' },
  //         { date: '2025-02-19', status: 'Present' },
  //         { date: '2025-02-18', status: 'Excused', remark: 'Family emergency' },
  //         { date: '2025-02-17', status: 'Present' },
  //         { date: '2025-02-16', status: 'Present' },
  //         { date: '2025-02-15', status: 'Present' },
  //       ];

  //       // Delay to simulate network request
  //       setTimeout(() => {
  //         setAttendanceRecords(mockRecords);
          
  //         // Calculate statistics
  //         const stats = mockRecords.reduce((acc, record) => {
  //           acc[record.status.toLowerCase()]++;
  //           return acc;
  //         }, { present: 0, absent: 0, late: 0, excused: 0 });
          
  //         const totalDays = mockRecords.length;
  //         const presentEquivalent = stats.present + (stats.late * 0.5) + (stats.excused * 1);
  //         const percentage = totalDays > 0 ? (presentEquivalent / totalDays) * 100 : 0;
          
  //         setAttendanceStats({
  //           ...stats,
  //           percentage: Math.round(percentage * 10) / 10
  //         });
          
  //         setLoading(false);
  //       }, 1000);
  //     } catch (err) {
  //       setError('Failed to fetch attendance records');
  //       setLoading(false);
  //     }
  //   };

  //   fetchAttendance();
  // }, [studentId]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Attendance Records</h3>
        <p className="mt-1 text-sm text-gray-600">
          View attendance history and statistics for this student.
        </p>
      </div>

      {/* Attendance Statistics */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance Summary</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
            <div className="bg-green-50 p-4 rounded-md text-center">
              <span className="block text-2xl font-bold text-green-600">{attendanceStats.present}</span>
              <span className="text-sm text-green-800">Present</span>
            </div>
            <div className="bg-red-50 p-4 rounded-md text-center">
              <span className="block text-2xl font-bold text-red-600">{attendanceStats.absent}</span>
              <span className="text-sm text-red-800">Absent</span>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <span className="block text-2xl font-bold text-yellow-600">{attendanceStats.late}</span>
              <span className="text-sm text-yellow-800">Late</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <span className="block text-2xl font-bold text-blue-600">{attendanceStats.excused}</span>
              <span className="text-sm text-blue-800">Excused</span>
            </div>
            <div className="bg-purple-50 p-4 rounded-md text-center">
              <span className="block text-2xl font-bold text-purple-600">{attendanceStats.percentage}%</span>
              <span className="text-sm text-purple-800">Attendance Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 
                      record.status === 'Absent' ? 'bg-red-100 text-red-800' : 
                      record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {record.remark || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
}
