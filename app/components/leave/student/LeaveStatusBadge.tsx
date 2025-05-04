import { LeaveStatus } from '~/types/studentLeave';

const statusColors = {
  [LeaveStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [LeaveStatus.APPROVED]: 'bg-green-100 text-green-800',
  [LeaveStatus.REJECTED]: 'bg-red-100 text-red-800',
  [LeaveStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
}

export function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
      {status}
    </span>
  );
}
