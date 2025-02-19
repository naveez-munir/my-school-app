import type { SubjectFiltersProps } from "~/types/subject";

export function SubjectFilters({
  globalFilter,
  onGlobalFilterChange,
  pageSize,
  onPageSizeChange
}: SubjectFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            placeholder="Search all columns..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Items per page</label>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
          >
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
