import { useState } from 'react';
import { format } from 'date-fns';
import { 
  AttendanceStatus, 
  AttendanceType, 
  type BatchAttendanceInput, 
  type BatchAttendanceRecord 
} from '~/types/attendance';

interface User {
  id: string;
  name: string;
  type: AttendanceType;
  rollNumber?: string;
  employeeId?: string;
}

interface Class {
  id: string;
  className: string;
  section: string;
}

interface BatchAttendanceFormProps {
  onSubmit: (data: BatchAttendanceInput) => void;
  onCancel: () => void;
  users: User[];
  classes: Class[];
  isLoading?: boolean;
}

export function BatchAttendanceForm({
  onSubmit,
  onCancel,
  users,
  classes,
  isLoading = false
}: BatchAttendanceFormProps) {
  const [userType, setUserType] = useState<AttendanceType>(AttendanceType.STUDENT);
  const [classId, setClassId] = useState<string>('');
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState<BatchAttendanceRecord[]>([]);
  const [defaultStatus, setDefaultStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);

  // Filter users based on selected user type
  const filteredUsers = users.filter(user => user.type === userType);

  // Handle class selection to initialize records
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClassId = e.target.value;
    setClassId(selectedClassId);
    
    // Initialize records for all users of the selected type
    if (selectedClassId) {
      const newRecords = filteredUsers.map(user => ({
        userId: user.id,
        status: defaultStatus,
        reason: ''
      }));
      setRecords(newRecords);
    } else {
      setRecords([]);
    }
  };

  // Handle user type change
  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUserType = e.target.value as AttendanceType;
    setUserType(newUserType);
    setRecords([]);
  };

  // Update status for a specific user
  const updateStatus = (userId: string, status: AttendanceStatus) => {
    setRecords(prev => 
      prev.map(record => 
        record.userId === userId 
          ? { ...record, status } 
          : record
      )
    );
  };

  // Update reason for a specific user
  const updateReason = (userId: string, reason: string) => {
    setRecords(prev => 
      prev.map(record => 
        record.userId === userId 
          ? { ...record, reason } 
          : record
      )
    );
  };

  // Handle "Mark All" functionality
  const markAllAs = (status: AttendanceStatus) => {
    setRecords(prev => 
      prev.map(record => ({
        ...record,
        status
      }))
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const batchData: BatchAttendanceInput = {
      userType,
      classId,
      date,
      records
    };
    
    onSubmit(batchData);
  };

  // Determine if form can be submitted
  const canSubmit = classId && date && records.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Batch Attendance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <select
              value={userType}
              onChange={handleUserTypeChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value={AttendanceType.STUDENT}>Student</option>
              <option value={AttendanceType.TEACHER}>Teacher</option>
            </select>
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={classId}
              onChange={handleClassChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.className} - {cls.section}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Quick Actions */}
        {records.length > 0 && (
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Mark all as:</span>
            <button
              type="button"
              onClick={() => markAllAs(AttendanceStatus.PRESENT)}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              Present
            </button>
            <button
              type="button"
              onClick={() => markAllAs(AttendanceStatus.ABSENT)}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
            >
              Absent
            </button>
            <button
              type="button"
              onClick={() => markAllAs(AttendanceStatus.LATE)}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
            >
              Late
            </button>
          </div>
        )}

        {/* User List */}
        {records.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  {userType === AttendanceType.STUDENT && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                  )}
                  {userType === AttendanceType.TEACHER && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => {
                  const record = records.find(r => r.userId === user.id);
                  if (!record) return null;
                  
                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      {userType === AttendanceType.STUDENT && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.rollNumber || '—'}
                        </td>
                      )}
                      {userType === AttendanceType.TEACHER && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.employeeId || '—'}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={record.status}
                          onChange={(e) => updateStatus(user.id, e.target.value as AttendanceStatus)}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value={AttendanceStatus.PRESENT}>Present</option>
                          <option value={AttendanceStatus.ABSENT}>Absent</option>
                          <option value={AttendanceStatus.LATE}>Late</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(record.status === AttendanceStatus.ABSENT || record.status === AttendanceStatus.LATE) && (
                          <input
                            type="text"
                            value={record.reason || ''}
                            onChange={(e) => updateReason(user.id, e.target.value)}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder={`Reason for being ${record.status.toLowerCase()}`}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : classId ? (
          <div className="text-center py-8 text-gray-500 border rounded-md">
            No {userType.toLowerCase()}s found for this class.
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border rounded-md">
            Select a class to load {userType.toLowerCase()}s.
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Submit Attendance'}
          </button>
        </div>
      </div>
    </form>
  );
}
