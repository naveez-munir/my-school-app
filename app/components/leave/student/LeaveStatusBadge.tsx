import { LeaveStatus } from '~/types/studentLeave';
import { 
  getLeaveStatusColor, 
  getLeaveStatusIcon, 
  getLeaveStatusLabel 
} from '~/utils/employeeStatusColor';

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function LeaveStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  showLabel = true,
  className = ''
}: LeaveStatusBadgeProps) {
  const statusColor = getLeaveStatusColor(status);
  const statusIcon = getLeaveStatusIcon(status);
  const statusLabel = getLeaveStatusLabel(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${statusColor} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <span className="mr-1">{statusIcon}</span>}
      {showLabel && statusLabel}
    </span>
  );
}
