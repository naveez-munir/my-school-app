interface LeaveBalanceCardProps {
  title: string;
  icon: string;
  allocated: number;
  used: number;
  remaining: number;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    progress: 'bg-blue-500',
    progressBg: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    progress: 'bg-green-500',
    progressBg: 'bg-green-100',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    progress: 'bg-purple-500',
    progressBg: 'bg-purple-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    progress: 'bg-yellow-500',
    progressBg: 'bg-yellow-100',
  },
};

export function LeaveBalanceCard({
  title,
  icon,
  allocated,
  used,
  remaining,
  color,
}: LeaveBalanceCardProps) {
  const percentage = allocated > 0 ? Math.round((used / allocated) * 100) : 0;
  const colors = colorClasses[color];

  return (
    <div
      className={`p-5 rounded-lg border-2 ${colors.bg} ${colors.border} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className={`font-semibold text-lg ${colors.text}`}>{title}</h3>
            <p className="text-sm text-gray-600">
              {used} / {allocated} days used
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${colors.text}`}>{remaining}</p>
          <p className="text-xs text-gray-500">days left</p>
        </div>
      </div>

      <div className={`w-full h-3 ${colors.progressBg} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colors.progress} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>{percentage}% utilized</span>
        {percentage > 80 && percentage < 100 && (
          <span className="text-orange-600 font-medium">⚠ Running low</span>
        )}
        {percentage >= 100 && (
          <span className="text-red-600 font-medium">❌ Exhausted</span>
        )}
      </div>
    </div>
  );
}
