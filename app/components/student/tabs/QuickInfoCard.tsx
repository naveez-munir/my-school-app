import { User, MapPin, Calendar } from 'lucide-react';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

interface QuickInfoCardProps {
  student: {
    cniNumber: string;
    dateOfBirth: string;
    admissionDate: string;
  };
}

export function QuickInfoCard({ student }: QuickInfoCardProps) {
  const quickInfoItems = [
    {
      icon: User,
      label: 'CNI Number',
      value: student.cniNumber
    },
    {
      icon: MapPin,
      label: 'Date of Birth',
      value: formatUserFriendlyDate(student.dateOfBirth)
    },
    {
      icon: Calendar,
      label: 'Admission Date',
      value: formatUserFriendlyDate(student.admissionDate)
    }
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Info</h3>
      
      <div className="space-y-5">
        {quickInfoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 text-blue-600 mt-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                <p className="text-gray-900 font-medium mt-1 break-words">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

