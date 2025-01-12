export function meta() {
  return [
    { title: "My Schedule" },
    { name: "description", content: "View your schedule" },
  ];
}

export default function SchedulePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-700 mb-4">
        My Schedule
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Schedule view coming soon...</p>
      </div>
    </div>
  );
}

