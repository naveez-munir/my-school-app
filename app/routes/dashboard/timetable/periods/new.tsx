import { useNavigate } from 'react-router';
import { PeriodForm } from '~/components/timetable/periods/PeriodForm';
import { ArrowLeft } from 'lucide-react';

export function meta() {
  return [
    { title: "Create Period" },
    { name: "description", content: "Create a new school period" },
  ];
}

export default function NewPeriodPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/timetable/periods')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Periods
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-700">
          Create New Period
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <PeriodForm
          onSuccess={() => navigate('/dashboard/timetable/periods')}
          onCancel={() => navigate('/dashboard/timetable/periods')}
        />
      </div>
    </div>
  );
}

