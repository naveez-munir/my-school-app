export function DailyDiaryListSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Filters skeleton */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table header */}
        <div className="bg-gray-50 px-6 py-3 flex border-b">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-4 bg-gray-200 rounded ${i === 5 ? 'ml-auto w-24' : 'mr-8 w-28'}`}></div>
          ))}
        </div>
        
        {/* Table rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex border-b">
            {[...Array(6)].map((_, j) => (
              <div 
                key={j} 
                className={`h-6 bg-gray-200 rounded ${j === 5 ? 'ml-auto w-32' : j === 3 ? 'w-36 mr-8' : 'w-28 mr-8'}`}
              ></div>
            ))}
          </div>
        ))}
        
        {/* Pagination skeleton */}
        <div className="px-6 py-3 flex items-center justify-between border-t">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
