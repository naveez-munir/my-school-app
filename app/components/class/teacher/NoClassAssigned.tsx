import { Mail } from 'lucide-react';

export function NoClassAssigned() {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Class Assigned
        </h2>
        <p className="text-gray-600 mb-6">
          You are not currently assigned as a class teacher.
          Please contact the administrator for assistance.
        </p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Mail size={16} />
          Contact Admin
        </button>
      </div>
    </div>
  );
}
