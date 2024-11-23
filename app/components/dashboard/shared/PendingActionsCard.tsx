import { AlertCircle, Clock, FileText } from 'lucide-react';

interface PendingAction {
  label: string;
  count: number;
  onClick?: () => void;
  icon?: 'clock' | 'alert' | 'file';
}

interface PendingActionsCardProps {
  actions: PendingAction[];
  isLoading?: boolean;
}

export function PendingActionsCard({ actions, isLoading = false }: PendingActionsCardProps) {
  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'clock':
        return Clock;
      case 'alert':
        return AlertCircle;
      case 'file':
        return FileText;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Pending Actions</h3>
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
      </div>

      {isLoading ? (
        <div className="space-y-2 sm:space-y-3">
          <div className="h-10 sm:h-12 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 sm:h-12 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 sm:h-12 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : actions.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm text-gray-500">No pending actions</p>
        </div>
      ) : (
        <div className="space-y-2">
          {actions.map((action, index) => {
            const IconComponent = getIcon(action.icon);
            return (
              <div
                key={index}
                onClick={action.onClick}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg border border-gray-200 ${
                  action.onClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <IconComponent className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs sm:text-sm text-gray-700">{action.label}</span>
                </div>
                {action.count > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                    {action.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

