export function FeeStructuresSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search skeleton */}
      <div className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="flex items-end">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-3 flex">
            <div className="h-5 bg-gray-300 rounded w-24 mr-10"></div>
            <div className="h-5 bg-gray-300 rounded w-20 mr-10"></div>
            <div className="h-5 bg-gray-300 rounded w-20 mr-10"></div>
            <div className="h-5 bg-gray-300 rounded w-28 mr-10"></div>
            <div className="h-5 bg-gray-300 rounded w-20 ml-auto"></div>
          </div>

          {/* Rows */}
          {[...Array(4)].map((_, index) => (
            <div key={index} className="px-6 py-4 flex items-center">
              <div className="h-5 bg-gray-200 rounded w-16 mr-10"></div>
              <div className="h-5 bg-gray-200 rounded w-24 mr-10"></div>
              <div className="h-5 bg-gray-200 rounded w-16 mr-10"></div>
              <div className="h-5 bg-gray-200 rounded w-28 mr-10"></div>
              <div className="ml-auto flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-8"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="px-6 py-3 flex items-center justify-between border-t">
          <div className="flex-1 flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-40"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
