import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function meta() {
  return [
    { title: "Create Exception" },
    { name: "description", content: "Create a new schedule exception or substitution" },
  ];
}

export default function NewExceptionPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/timetable/exceptions')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exceptions
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-700">
          Create New Exception
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Exception creation form coming soon...</p>
      </div>
    </div>
  );
}

