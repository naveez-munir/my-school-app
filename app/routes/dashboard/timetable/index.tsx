import { useNavigate } from 'react-router';
import { Clock, BookOpen, Calendar, AlertCircle } from 'lucide-react';

export function meta() {
  return [
    { title: "Timetable Management" },
    { name: "description", content: "Manage school timetables, periods, and allocations" },
  ];
}

export default function TimetableIndex() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Period Management',
      description: 'Configure school periods, break times, and schedules',
      icon: Clock,
      path: '/dashboard/timetable/periods',
      color: 'blue'
    },
    {
      title: 'Class Subject Allocations',
      description: 'Assign teachers to subjects for each class',
      icon: BookOpen,
      path: '/dashboard/timetable/allocations',
      color: 'green'
    },
    {
      title: 'Timetables',
      description: 'Create and manage class timetables',
      icon: Calendar,
      path: '/dashboard/timetable/timetables',
      color: 'purple'
    },
    {
      title: 'Exceptions & Substitutions',
      description: 'Manage teacher absences and schedule changes',
      icon: AlertCircle,
      path: '/dashboard/timetable/exceptions',
      color: 'orange'
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-xs sm:text-sm lg:text-base font-bold tracking-tight text-gray-700">
          Timetable Management
        </h1>
        <p className="text-xs lg:text-sm text-gray-500 mt-2">
          Manage school schedules, periods, and teacher allocations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          }[section.color];

          return (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${colorClasses}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {section.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

