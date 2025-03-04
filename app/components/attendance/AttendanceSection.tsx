import { useState } from 'react';
import { useAttendanceRecords, useDeleteAttendance } from '~/hooks/useAttendanceQueries';
import { 
  type AttendanceRecord, 
  AttendanceType 
} from '~/types/attendance';
import { AttendanceTable } from '~/components/attendance/AttendanceTable';
import { useNavigate } from 'react-router';
import { SelectInput } from '../common/form/inputs/SelectInput';
import { DateInput } from '../common/form/inputs/DateInput';
import { PlusCircle } from 'lucide-react';

export function AttendanceSection() {
  const [userType, setUserType] = useState<AttendanceType | undefined>(AttendanceType.STUDENT);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const navigate = useNavigate();

  const queryParams = {
    ...(userType && { userType }),
    ...(startDate && { startDate: new Date(startDate).toISOString() }),
    ...(endDate && { endDate: new Date(endDate).toISOString() })
  };

  const { data, isLoading, isError, refetch } = useAttendanceRecords(queryParams);
  const deleteAttendanceMutation = useDeleteAttendance();

  const handleViewDetails = (record: AttendanceRecord) => {
    navigate(`/dashboard/attendance/${record.id}`);
  };
  
  const handleEdit = (record: AttendanceRecord) => {
    navigate(`/dashboard/attendance/${record.id}/edit`);
  };
  
  const handleDelete = (id: string) => {
    // TODO: Add proper confirmation dialog before deleting
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      deleteAttendanceMutation.mutate(id, {
        onSuccess: () => {
          alert('Attendance record deleted successfully');
          refetch();
        },
        onError: (error) => {
          alert('Failed to delete attendance record');
          console.error('Delete error:', error);
        }
      });
    }
  };

  const handleAddAttendance = () => {
    navigate('/dashboard/attendance/new');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Records</h1>
        <button
          onClick={handleAddAttendance}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <PlusCircle size={18} />
          <span>Add Attendance</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          <SelectInput<typeof AttendanceType>
            label="User Type"
            value={userType}
            onChange={(value) => setUserType(value as AttendanceType || undefined)}
            options={AttendanceType}
            placeholder="All Types"
          />
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

        <div className="flex justify-end">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Attendance Records</h2>
          <span className="text-sm text-gray-500">
            {data ? `${data.length} records found` : ''}
          </span>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading attendance records...
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500 border rounded-md">
            Error loading attendance records. Please try again.
          </div>
        ) : data && data.length > 0 ? (
          <AttendanceTable
            data={data}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            userType={userType}
          />
        ) : (
          <div className="text-center py-8 text-gray-500 border rounded-md">
            No attendance records found with the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
