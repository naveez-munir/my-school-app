import { useNavigate } from 'react-router';
import { useMyStudentsLeaves } from '~/hooks/useStudentLeaveQueries';
import { LeaveBaseTable } from './LeaveBaseTable';

export function MyStudentsLeavesTable() {
  const navigate = useNavigate();
  const { data = [], isLoading, error } = useMyStudentsLeaves();
  
  const handleViewDetails = (id: string) => {
    navigate(`/student-leaves/${id}`);
  };

  return (
    <LeaveBaseTable
      data={data}
      isLoading={isLoading}
      error={error}
      title="My Students' Leave Requests"
      config={{
        showStudent: true,
        actions: (row) => (
          <button 
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => handleViewDetails(row._id)}
          >
            View Details
          </button>
        )
      }}
    />
  );
}
