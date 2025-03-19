export function SalaryStructuresSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
      </div>

      <div className="bg-white rounded-lg shadow animate-pulse">
        <div className="flex items-center p-3 bg-gray-50">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-6 py-3 w-1/6">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>

        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center p-3 border-t">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="px-6 py-3 w-1/6">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ))}

        <div className="border-t p-3 flex justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
