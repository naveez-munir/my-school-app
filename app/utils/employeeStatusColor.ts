import { LeaveStatus } from '~/types/studentLeave';
export const getEmploymentStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'OnLeave':
      return 'bg-yellow-100 text-yellow-800';
    case 'Resigned':
      return 'bg-gray-100 text-gray-800';
    case 'Terminated':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface StatusStyle {
  color: string;
  icon: string;
  label: string;
  border?: string;
}

export const leaveStatusConfig: Record<LeaveStatus, StatusStyle> = {
  [LeaveStatus.PENDING]: {
    color: 'bg-yellow-100 text-yellow-800',
    border: 'border-yellow-200',
    icon: '⏳',
    label: 'Pending Approval'
  },
  [LeaveStatus.APPROVED]: {
    color: 'bg-green-100 text-green-800',
    border: 'border-green-200',
    icon: '✓',
    label: 'Approved'
  },
  [LeaveStatus.REJECTED]: {
    color: 'bg-red-100 text-red-800',
    border: 'border-red-200',
    icon: '✗',
    label: 'Rejected'
  },
  [LeaveStatus.CANCELLED]: {
    color: 'bg-gray-100 text-gray-800',
    border: 'border-gray-200',
    icon: '○',
    label: 'Cancelled'
  },
};

export const getLeaveStatusColor = (status: LeaveStatus): string => {
  return leaveStatusConfig[status]?.color || 'bg-gray-100 text-gray-800';
};

export const getLeaveStatusBorder = (status: LeaveStatus): string => {
  return leaveStatusConfig[status]?.border || 'border-gray-200';
};

export const getLeaveStatusIcon = (status: LeaveStatus): string => {
  return leaveStatusConfig[status]?.icon || '•';
};

export const getLeaveStatusLabel = (status: LeaveStatus): string => {
  return leaveStatusConfig[status]?.label || status;
};

export const getLeaveStatusStyle = (status: LeaveStatus): StatusStyle => {
  return leaveStatusConfig[status] || {
    color: 'bg-gray-100 text-gray-800',
    border: 'border-gray-200',
    icon: '•',
    label: status
  };
};

export const getLeaveTypeStyle = (leaveType: string): string => {
  switch (leaveType.toLowerCase().replace('_', ' ')) {
    case 'sick leave':
      return 'bg-red-100 text-red-800';
    case 'casual leave':
      return 'bg-blue-100 text-blue-800';
    case 'annual leave':
      return 'bg-green-100 text-green-800';
    case 'maternity leave':
      return 'bg-purple-100 text-purple-800';
    case 'paternity leave':
      return 'bg-indigo-100 text-indigo-800';
    case 'bereavement leave':
      return 'bg-gray-100 text-gray-800';
    case 'study leave':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};
