import type { LucideIcon } from 'lucide-react';

interface QuickLink {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
}

interface QuickLinksCardProps {
  links: QuickLink[];
}

export function QuickLinksCard({ links }: QuickLinksCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {links.map((link, index) => {
          const IconComponent = link.icon;
          const colorClass = link.color || 'text-blue-600';
          return (
            <button
              key={index}
              onClick={link.onClick}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all"
            >
              <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${colorClass}`} />
              <span className="text-xs text-gray-700 text-center">{link.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

