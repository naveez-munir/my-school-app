import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import {
  AttendanceStatus,
  AttendanceType,
  type BatchAttendanceInput,
  type BatchAttendanceRecord
} from '~/types/attendance';
import { useCheckApprovedLeaves, getDefaultAttendanceStatus } from '~/hooks/useLeaveIntegration';

interface User {
  id: string;
  name: string;
  type: AttendanceType;
  rollNumber?: string;
  employeeId?: string;
  photoUrl?: string;
  classId?: string;
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
  initialUserType?: AttendanceType;
  initialClassId?: string;
  hideUserTypeSelector?: boolean;
  hideClassSelector?: boolean;
}

export function BatchAttendanceForm({
  onSubmit,
  onCancel,
  users,
  classes,
  isLoading = false,
  initialUserType = AttendanceType.STUDENT,
  initialClassId = '',
  hideUserTypeSelector = false,
  hideClassSelector = false
}: BatchAttendanceFormProps) {
  const [userType, setUserType] = useState<AttendanceType>(initialUserType);
  const [classId, setClassId] = useState<string>(initialClassId);
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [recordOverrides, setRecordOverrides] = useState<Record<string, { status?: AttendanceStatus; reason?: string }>>({});
  const [defaultStatus, setDefaultStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);

  const allStudents = useMemo(() => {
    return users.filter(user => user.type === AttendanceType.STUDENT);
  }, [users]);

  const allStudentIds = useMemo(() => {
    return allStudents.map(user => user.id);
  }, [allStudents]);

  const { data: leaveStatuses = [] } = useCheckApprovedLeaves(AttendanceType.STUDENT, date, allStudentIds);

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => user.type === userType);

    if (userType === AttendanceType.STUDENT && classId) {
      filtered = filtered.filter(user => user.classId === classId);
    }

    return filtered;
  }, [users, userType, classId]);

  const records = useMemo(() => {
    if (userType === AttendanceType.STUDENT && !classId) {
      return [];
    }

    return filteredUsers.map(user => {
      const leaveStatus = leaveStatuses.find(ls => ls.userId === user.id);
      const defaultStatus = getDefaultAttendanceStatus(leaveStatus?.hasApprovedLeave || false);
      const defaultReason = leaveStatus?.hasApprovedLeave ? `Approved ${leaveStatus.leaveType} leave` : '';

      const override = recordOverrides[user.id];

      return {
        userId: user.id,
        status: override?.status ?? defaultStatus,
        reason: override?.reason ?? defaultReason
      };
    });
  }, [filteredUsers, leaveStatuses, recordOverrides, userType, classId]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClassId = e.target.value;
    setClassId(selectedClassId);
    setRecordOverrides({});
  };



  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUserType = e.target.value as AttendanceType;
    setUserType(newUserType);
    setClassId('');
    setRecordOverrides({});
  };

  const updateStatus = (userId: string, status: AttendanceStatus) => {
    setRecordOverrides(prev => ({
      ...prev,
      [userId]: { ...prev[userId], status }
    }));
  };

  const updateReason = (userId: string, reason: string) => {
    setRecordOverrides(prev => ({
      ...prev,
      [userId]: { ...prev[userId], reason }
    }));
  };

  const markAllAs = (status: AttendanceStatus) => {
    const newOverrides: Record<string, { status?: AttendanceStatus; reason?: string }> = {};
    filteredUsers.forEach(user => {
      newOverrides[user.id] = { ...recordOverrides[user.id], status };
    });
    setRecordOverrides(prev => ({ ...prev, ...newOverrides }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const batchData: BatchAttendanceInput = {
      userType,
      ...(userType === AttendanceType.STUDENT && classId && { classId }),
      date,
      records
    };

    onSubmit(batchData);
  };

  // Determine if form can be submitted
  const canSubmit = date && records.length > 0 && (
    userType !== AttendanceType.STUDENT || classId
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Batch Attendance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* User Type */}
          {!hideUserTypeSelector && (
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
                <option value={AttendanceType.STAFF}>Staff</option>
              </select>
            </div>
          )}

          {/* Class Selection - Only for students */}
          {userType === AttendanceType.STUDENT && !hideClassSelector && (
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
          )}

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
            <button
              type="button"
              onClick={() => markAllAs(AttendanceStatus.LEAVE)}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              Leave
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
                  {userType === AttendanceType.STAFF && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
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
                  const leaveStatus = leaveStatuses.find(ls => ls.userId === user.id);
                  if (!record) return null;

                  return (
                    <tr key={user.id} className={leaveStatus?.hasApprovedLeave ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                            {user.photoUrl ? (
                              <img
                                src={user.photoUrl}
                                alt={user.name}
                                className="h-8 w-8 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ${user.photoUrl ? 'hidden' : 'flex'}`}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            {leaveStatus?.hasApprovedLeave && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                Approved Leave
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {userType === AttendanceType.STUDENT && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.rollNumber || '—'}
                        </td>
                      )}
                      {userType === AttendanceType.STAFF && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {user.employeeId || 'Staff'}
                          </span>
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
                          <option value={AttendanceStatus.LEAVE}>Leave</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(record.status === AttendanceStatus.ABSENT || record.status === AttendanceStatus.LATE || record.status === AttendanceStatus.LEAVE) && (
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
