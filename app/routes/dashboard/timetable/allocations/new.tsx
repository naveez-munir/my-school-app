import { useNavigate } from 'react-router';
import { AllocationForm } from '~/components/timetable/allocations/AllocationForm';
import { ArrowLeft } from 'lucide-react';

export function meta() {
  return [
    { title: "Create Allocation" },
    { name: "description", content: "Create a new class subject allocation" },
  ];
}

export default function NewAllocationPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/timetable/allocations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Allocations
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-700">
          Create New Allocation
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <AllocationForm
          onSuccess={() => navigate('/dashboard/timetable/allocations')}
          onCancel={() => navigate('/dashboard/timetable/allocations')}
        />
      </div>
    </div>
  );
}

