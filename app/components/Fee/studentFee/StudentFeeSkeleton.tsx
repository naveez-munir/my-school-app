export function StudentFeeSkeleton() {
  return (
    <div className="space-y-6">
      {/* Status summary skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              <div className="rounded-full bg-gray-200 h-8 w-8"></div>
            </div>
            <div className="h-7 bg-gray-200 rounded w-2/3 mt-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
          </div>
        ))}
      </div>

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
            <div className="h-5 bg-gray-300 rounded w-24 mr-6"></div>
            <div className="h-5 bg-gray-300 rounded w-16 mr-6"></div>
            <div className="h-5 bg-gray-300 rounded w-16 mr-6"></div>
            <div className="h-5 bg-gray-300 rounded w-20 mr-6"></div>
            <div className="h-5 bg-gray-300 rounded w-24 mr-6"></div>
            <div className="h-5 bg-gray-300 rounded w-24 mr-6"></div>
            <div className="h-5 bg-gray-300 rounded w-24 mr-6"></div>
            <div className="h-5 bg-gray-300 rounded w-20 ml-auto"></div>
          </div>

          {/* Rows */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="px-6 py-4 flex">
              <div className="mr-6">
                <div className="h-5 bg-gray-200 rounded w-28 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-16 mr-6"></div>
              <div className="h-5 bg-gray-200 rounded w-16 mr-6"></div>
              <div className="h-5 bg-gray-200 rounded w-20 mr-6"></div>
              <div className="h-5 bg-gray-200 rounded w-24 mr-6"></div>
              <div className="h-5 bg-gray-200 rounded w-24 mr-6"></div>
              <div className="h-5 bg-gray-200 rounded w-24 mr-6"></div>
              <div className="ml-auto flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-6"></div>
                <div className="h-6 bg-gray-200 rounded w-6"></div>
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
