import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  iconColor: string;
  subtitle?: string;
  onClick?: () => void;
  isLoading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  additionalInfo?: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  bgColor,
  textColor,
  iconColor,
  subtitle,
  onClick,
  isLoading = false,
  trend,
  additionalInfo
}: SummaryCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value === 0) return <Minus className="h-4 w-4 text-gray-500" />;
    return trend.isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = () => {
    if (!trend || trend.value === 0) return 'text-gray-500';
    return trend.isPositive ? 'text-green-600' : 'text-red-600';
  };
  const cardClasses = `${bgColor} rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 ${
    onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
  }`;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-6 sm:h-8 w-20 sm:w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className={`text-2xl sm:text-3xl font-bold ${textColor}`}>{value}</p>
          )}

          {trend && !isLoading && (
            <div className="flex items-center space-x-1 mt-1.5 sm:mt-2">
              {getTrendIcon()}
              <span className={`text-xs sm:text-sm font-medium ${getTrendColor()}`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              {trend.label && (
                <span className="text-xs text-gray-500">{trend.label}</span>
              )}
            </div>
          )}

          {additionalInfo && !isLoading && (
            <p className="text-xs text-gray-600 mt-1 font-medium">{additionalInfo}</p>
          )}

          {subtitle && !trend && !additionalInfo && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${iconColor} p-2 sm:p-3 rounded-full bg-white bg-opacity-50`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}

