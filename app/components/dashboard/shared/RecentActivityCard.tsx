import { useMemo } from 'react';
import { 
  UserPlus, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Activity {
  id: string;
  type: 'admission' | 'payment' | 'leave_request' | 'leave_approved' | 'attendance' | 'other';
  description: string;
  timestamp: Date | string;
  metadata?: Record<string, string | number>;
}

interface RecentActivityCardProps {
  activities: Activity[];
  isLoading?: boolean;
  maxItems?: number;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'admission':
      return <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
    case 'payment':
      return <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
    case 'leave_request':
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
    case 'leave_approved':
      return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
    case 'attendance':
      return <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />;
    default:
      return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'admission':
      return 'bg-blue-50 border-blue-200';
    case 'payment':
      return 'bg-green-50 border-green-200';
    case 'leave_request':
      return 'bg-yellow-50 border-yellow-200';
    case 'leave_approved':
      return 'bg-green-50 border-green-200';
    case 'attendance':
      return 'bg-purple-50 border-purple-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export function RecentActivityCard({ 
  activities, 
  isLoading = false,
  maxItems = 5 
}: RecentActivityCardProps) {
  const sortedActivities = useMemo(() => {
    return [...activities]
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      })
      .slice(0, maxItems);
  }, [activities, maxItems]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activity</h3>
        <div className="space-y-2 sm:space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-start space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activity</h3>
        <div className="text-center py-6 sm:py-8">
          <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activity</h3>
      <div className="space-y-2 sm:space-y-3">
        {sortedActivities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg border ${getActivityColor(activity.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
      {activities.length > maxItems && (
        <div className="mt-3 sm:mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all activity →
          </button>
        </div>
      )}
    </div>
  );
}

