import { useQuery } from '@tanstack/react-query';
import { studentLeaveApi } from '~/services/studentLeaveApi';
import { AttendanceType, AttendanceStatus } from '~/types/attendance';
import { LeaveStatus } from '~/types/studentLeave';
import { format } from 'date-fns';

interface UserLeaveStatus {
  userId: string;
  hasApprovedLeave: boolean;
  leaveType?: string;
  leaveDates?: { startDate: string; endDate: string };
}

export const useCheckApprovedLeaves = (
  userType: AttendanceType,
  date: string,
  userIds: string[]
) => {
  return useQuery({
    queryKey: ['approved-leaves', userType, date, userIds],
    queryFn: async (): Promise<UserLeaveStatus[]> => {
      if (userType !== AttendanceType.STUDENT || !userIds.length) {
        return userIds.map(id => ({ userId: id, hasApprovedLeave: false }));
      }

      const checkDate = format(new Date(date), 'yyyy-MM-dd');

      const results = await Promise.all(
        userIds.map(async (userId) => {
          try {
            const leaves = await studentLeaveApi.getLeavesByStudent(userId);

            const approvedLeave = leaves.find(leave =>
              leave.status === LeaveStatus.APPROVED &&
              leave.isSyncedWithAttendance &&
              checkDate >= leave.startDate.split('T')[0] &&
              checkDate <= leave.endDate.split('T')[0]
            );

            return {
              userId,
              hasApprovedLeave: !!approvedLeave,
              leaveType: approvedLeave?.leaveType,
              leaveDates: approvedLeave ? {
                startDate: approvedLeave.startDate,
                endDate: approvedLeave.endDate
              } : undefined
            };
          } catch (error) {
            console.warn(`Failed to fetch leaves for user ${userId}:`, error);
            return { userId, hasApprovedLeave: false };
          }
        })
      );

      return results;
    },
    enabled: !!date && userIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const getDefaultAttendanceStatus = (
  hasApprovedLeave: boolean
): AttendanceStatus => {
  return hasApprovedLeave ? AttendanceStatus.LEAVE : AttendanceStatus.PRESENT;
};