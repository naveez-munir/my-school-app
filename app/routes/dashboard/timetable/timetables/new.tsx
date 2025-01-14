import { useNavigate } from 'react-router';
import { TimetableForm } from '~/components/timetable/timetables/TimetableForm';
import { Calendar, ArrowLeft } from 'lucide-react';

export function meta() {
  return [
    { title: "Create Timetable" },
    { name: "description", content: "Create a new class timetable" },
  ];
}

export default function NewTimetablePage() {
  const navigate = useNavigate();

  const handleSuccess = (timetableId: string) => {
    navigate(`/dashboard/timetable/timetables/${timetableId}`);
  };

  const handleCancel = () => {
    navigate('/dashboard/timetable/timetables');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Timetables
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-gray-600" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">
            Create New Timetable
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Create a new timetable for a class
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <TimetableForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}

