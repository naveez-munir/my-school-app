
import { useState } from 'react';
import { fetchSubjects } from '~/store/features/subjectSlice';
import { useAppDispatch } from '~/store/hooks';
import type { SubjectDto } from '~/types/subject';
export function SubjectFilters() {
  const [filters, setFilters] = useState<Partial<SubjectDto>>({
    subjectName: '',
    subjectCode: ''
  });
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchSubjects(filters));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Name</label>
          <input
            type="text"
            value={filters.subjectName}
            onChange={(e) => setFilters(prev => ({ ...prev, subjectName: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
            placeholder="Search by name..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Code</label>
          <input
            type="text"
            value={filters.subjectCode}
            onChange={(e) => setFilters(prev => ({ ...prev, subjectCode: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
            placeholder="Search by code..."
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
