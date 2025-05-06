import { useParams, useNavigate } from 'react-router';
import { useStudentLeavesByStudent } from '~/hooks/useStudentLeaveQueries';
import { LeaveBaseTable } from './LeaveBaseTable';

export function LeavesByStudentTable() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { data = [], isLoading, error } = useStudentLeavesByStudent(studentId || '');
  
  const handleViewDetails = (id: string) => {
    navigate(`/student-leaves/${id}`);
  };

  const studentName = data.length > 0 ? `Student ${data[0].studentId}` : `Student ${studentId}`;

  return (
    <LeaveBaseTable
      data={data}
      isLoading={isLoading}
      error={error}
      title={`${studentName}'s Leave History`}
      config={{
        showReason: true,
        actions: (row) => (
          <button 
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => handleViewDetails(row._id)}
          >
            View Details
          </button>
        )
      }}
      headerContent={
        <button 
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      }
    />
  );
}
