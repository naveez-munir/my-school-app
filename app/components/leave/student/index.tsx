import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useStudentLeaves } from '~/hooks/useStudentLeaveQueries';
import { LeaveStatus } from '~/types/studentLeave';
import { ClassSelector } from '~/components/common/ClassSelector';
import { StudentSelector } from '~/components/common/StudentSelector';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { LeaveBaseTable } from './LeaveBaseTable';

export function AllStudentLeavesTable() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    status: LeaveStatus | '';
    classId: string;
    studentId: string;
  }>({
    status: '',
    classId: '',
    studentId: '',
  });

  const queryParams = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.studentId ? { studentId: filters.studentId } : {})
  };

  const { data: leaves = [], isLoading, error } = useStudentLeaves(queryParams);
  
  const handleClassChange = (classId: string) => {
    setFilters(prev => ({
      ...prev,
      classId,
      studentId: ''
    }));
  };
  
  const handleStudentChange = (studentId: string) => {
    setFilters(prev => ({
      ...prev,
      studentId
    }));
  };
  
  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status as LeaveStatus | ''
    }));
  };
  
  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/leave/student/detail/${id}`);
  };
  
  const handleClearFilters = () => {
    setFilters({
      status: '',
      classId: '',
      studentId: ''
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading student leaves...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading student leave data</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xs sm:text-sm lg:text-base font-semibold">All Student Leave Requests</h1>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xs sm:text-sm font-medium mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <ClassSelector
              value={filters.classId}
              onChange={handleClassChange}
              label="Filter by Class"
              className="w-full" 
            />
          </div>
          
          <div>
            {filters.classId ? (
              <StudentSelector
                value={filters.studentId}
                onChange={handleStudentChange}
                classId={filters.classId}
                label="Filter by Student"
                className="w-full"
              />
            ) : (
              <div className="h-[72px]"></div> // Empty space holder to maintain layout
            )}
          </div>
          <SelectInput<typeof LeaveStatus>
            label="Status"
            value={filters.status as LeaveStatus}
            onChange={(value) => handleStatusChange(value)}
            options={LeaveStatus}
            placeholder="Select Leave Status"
          />

        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <LeaveBaseTable
        data={leaves}
        isLoading={false}
        error={null}
        title=""
        config={{
          showStudent: true,
          showRequestedBy: true,
          showApprovedBy: true,
          showCreatedAt: true,
          actions: (row) => (
            <button
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => handleViewDetails(row.id || row._id || '')}
            >
              View Details
            </button>
          )
        }}
      />
    </div>
  );
}
