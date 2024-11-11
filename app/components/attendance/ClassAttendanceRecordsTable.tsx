import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import type { AttendanceRecord } from '~/types/attendance';
import { AttendanceStatus } from '~/types/attendance';

interface ClassAttendanceRecordsTableProps {
  records: AttendanceRecord[];
}

type GroupByType = 'date' | 'student';

export function ClassAttendanceRecordsTable({ records }: ClassAttendanceRecordsTableProps) {
  const [groupBy, setGroupBy] = useState<GroupByType>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const getStatusBadge = (status: AttendanceStatus) => {
    const statusConfig = {
      [AttendanceStatus.PRESENT]: { label: 'Present', icon: '✓' },
      [AttendanceStatus.ABSENT]: { label: 'Absent', icon: '✗' },
      [AttendanceStatus.LATE]: { label: 'Late', icon: '⏰' },
      [AttendanceStatus.LEAVE]: { label: 'Leave', icon: '📅' },
    };

    const config = statusConfig[status] || statusConfig[AttendanceStatus.PRESENT];

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDateDisplay = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return '—';
    }
  };

  const getDayOfWeek = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE');
    } catch {
      return '';
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        searchQuery === '' ||
        record.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.user.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const groupedRecords = useMemo(() => {
    const groups: Record<string, AttendanceRecord[]> = {};

    filteredRecords.forEach((record) => {
      const key = groupBy === 'date' ? record.date : record.user.id;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(record);
    });

    return groups;
  }, [filteredRecords, groupBy]);

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedRecords).sort((a, b) => {
      if (groupBy === 'date') {
        return new Date(b).getTime() - new Date(a).getTime();
      } else {
        const nameA = groupedRecords[a][0]?.user.name || '';
        const nameB = groupedRecords[b][0]?.user.name || '';
        return nameA.localeCompare(nameB);
      }
    });
  }, [groupedRecords, groupBy]);

  useMemo(() => {
    if (sortedGroupKeys.length > 0) {
      setExpandedGroups(new Set([sortedGroupKeys[0]]));
    }
  }, [sortedGroupKeys]);

  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">📋</div>
        <p className="text-gray-600">No attendance records found</p>
        <p className="text-gray-400 text-sm mt-1">Records will appear here once attendance is marked</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Attendance Records</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupByType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name or Roll Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedGroupKeys.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No records match your filters
          </div>
        ) : (
          sortedGroupKeys.map((groupKey) => {
            const groupRecords = groupedRecords[groupKey];
            const isExpanded = expandedGroups.has(groupKey);
            const firstRecord = groupRecords[0];

            const groupTitle =
              groupBy === 'date'
                ? `${formatDateDisplay(groupKey)} (${getDayOfWeek(groupKey)})`
                : `${firstRecord.user.name} - Roll #${firstRecord.user.rollNumber || 'N/A'}`;

            return (
              <div key={groupKey}>
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900">
                      {groupBy === 'date' ? '📅' : '👤'} {groupTitle}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{groupRecords.length} record{groupRecords.length !== 1 ? 's' : ''}</span>
                </button>

                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {groupBy === 'date' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll #</th>
                          )}
                          {groupBy === 'date' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                          )}
                          {groupBy === 'student' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            {groupBy === 'date' && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {record.user.rollNumber || '—'}
                              </td>
                            )}
                            {groupBy === 'date' && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {record.user.name}
                              </td>
                            )}
                            {groupBy === 'student' && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDateDisplay(record.date)}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(record.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.checkInTime || '—'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                              {record.reason || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

