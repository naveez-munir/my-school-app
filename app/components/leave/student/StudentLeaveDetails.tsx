import { useParams, useNavigate } from 'react-router';
import { useStudentLeave, useCancelStudentLeave } from '~/hooks/useStudentLeaveQueries';
import { LeaveStatus } from '~/types/studentLeave';
import toast from 'react-hot-toast';

export function StudentLeaveDetailsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: leave, isLoading, error } = useStudentLeave(id || '');
  const { mutate: cancelLeave, isPending: isCancelling } = useCancelStudentLeave();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading leave details...</div>;
  }

  if (error || !leave) {
    return <div className="text-red-500 p-4">Error loading leave details</div>;
  }

  const handleCancelLeave = () => {
    if (!leave.id) return;
    
    cancelLeave(leave.id, {
      onSuccess: () => {
        toast.success('Leave request cancelled successfully');
        navigate(-1);
      },
      onError: (error) => {
        toast.error(`Failed to cancel leave request: ${error.message}`);
      },
    });
  };

  const statusColors = {
    [LeaveStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [LeaveStatus.APPROVED]: 'bg-green-100 text-green-800',
    [LeaveStatus.REJECTED]: 'bg-red-100 text-red-800',
    [LeaveStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Leave Request Details</h1>
        <button 
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Leave Request #{leave.id}</h2>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[leave.status]}`}>
            {leave.status}
          </span>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Student ID</p>
              <p>{leave.studentId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Leave Type</p>
              <p>{leave.leaveType.replace('_', ' ')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Start Date</p>
              <p>{new Date(leave.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p>{new Date(leave.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Number of Days</p>
              <p>{leave.numberOfDays}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Reason</p>
            <p className="whitespace-pre-wrap">{leave.reason || '-'}</p>
          </div>
          
          {leave.supportingDocumentUrl && (
            <div>
              <p className="text-sm font-medium text-gray-500">Supporting Document</p>
              <a 
                href={leave.supportingDocumentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Document
              </a>
            </div>
          )}
          
          {leave.approvedBy && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Approved By</p>
                <p>{leave.approvedBy} ({leave.approverType})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Approval Date</p>
                <p>{leave.approvalDate ? new Date(leave.approvalDate).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          )}
          
          {leave.comments && (
            <div>
              <p className="text-sm font-medium text-gray-500">Comments</p>
              <p className="whitespace-pre-wrap">{leave.comments}</p>
            </div>
          )}
          
          {leave.affectedClasses && leave.affectedClasses.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500">Affected Classes</p>
              <ul className="list-disc pl-5">
                {leave.affectedClasses.map((cls, index) => (
                  <li key={index}>{cls}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Requested By</p>
              <p>{leave.requestedByParent}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p>{new Date(leave.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {leave.status === LeaveStatus.PENDING && (
          <div className="p-4 border-t">
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={handleCancelLeave}
              disabled={isCancelling}
            >
              Cancel Leave Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
