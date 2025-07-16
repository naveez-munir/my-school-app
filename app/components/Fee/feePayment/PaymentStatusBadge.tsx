import { PaymentStatus } from "~/types/studentFee";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  let className = "";
  
  switch (status) {
    case PaymentStatus.SUCCESS:
      className = "bg-green-100 text-green-800";
      break;
    case PaymentStatus.PENDING:
      className = "bg-yellow-100 text-yellow-800";
      break;
    case PaymentStatus.FAILED:
      className = "bg-red-100 text-red-800";
      break;
    case PaymentStatus.CANCELLED:
      className = "bg-gray-100 text-gray-800";
      break;
    default:
      className = "bg-blue-100 text-blue-800";
  }
  
  const displayText = status.charAt(0) + status.slice(1).toLowerCase();
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${className}`}>
      {displayText}
    </span>
  );
}
