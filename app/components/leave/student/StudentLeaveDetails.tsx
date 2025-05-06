import { useParams, useNavigate } from "react-router";
import {
  useStudentLeave,
  useCancelStudentLeave,
} from "~/hooks/useStudentLeaveQueries";
import { LeaveStatus } from "~/types/studentLeave";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useStudentName } from "~/utils/hooks/useStudentName";
import { getLeaveTypeStyle } from "~/utils/employeeStatusColor";
import { LeaveStatusBadge } from "./LeaveStatusBadge";

export function StudentLeaveDetailsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: leave, isLoading, error } = useStudentLeave(id || "");
  const { mutate: cancelLeave, isPending: isCancelling } =
    useCancelStudentLeave();

  const studentName = useStudentName(leave?.studentId || "");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading leave details...</p>
      </div>
    );
  }

  if (error || !leave) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <div className="font-bold">Error loading leave details</div>
        <p className="text-sm">
          {error?.message || "Unable to load the requested leave information"}
        </p>
        <button
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleCancelLeave = () => {
    if (!leave._id) return;

    cancelLeave(leave._id, {
      onSuccess: () => {
        toast.success("Leave request cancelled successfully");
        navigate(-1);
      },
      onError: (error) => {
        toast.error(`Failed to cancel leave request: ${error.message}`);
      },
    });
  };

  const leaveTypeStyle = getLeaveTypeStyle(leave.leaveType);

  const formatDate = (dateString: any) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center">
            <button
              className="mr-3 p-2 rounded-full hover:bg-gray-100"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Leave Request Details
            </h1>
          </div>
          <p className="text-gray-500 mt-1">
            Request #{leave._id.substring(leave._id.length - 6).toUpperCase()}
          </p>
        </div>

        <LeaveStatusBadge
          status={leave.status}
          size="lg"
          className="mt-4 md:mt-0 border"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {/* Student & Leave Type Section */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-800">
                {studentName || leave.studentId}
              </h2>
              <p className="text-gray-600">Student ID: {leave.studentId}</p>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${leaveTypeStyle}`}
              >
                {leave.leaveType.replace("_", " ")}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Requested on {format(new Date(leave.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Leave Duration
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className="text-blue-500 mr-3 text-xl">🗓️</span>
                <span className="font-medium text-gray-800">
                  {leave.numberOfDays}{" "}
                  {leave.numberOfDays === 1 ? "day" : "days"}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-500 mr-2">From:</span>
                <span className="font-medium">
                  {formatDate(leave.startDate)}
                </span>
              </div>

              {leave.numberOfDays > 1 && (
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">To:</span>
                  <span className="font-medium">
                    {formatDate(leave.endDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Reason for Leave
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="whitespace-pre-wrap">
              {leave.reason || "No reason provided"}
            </p>
          </div>

          {leave.supportingDocumentUrl && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Supporting Document
              </h4>
              <a
                href={leave.supportingDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span className="mr-2">📎</span>
                View Document
              </a>
            </div>
          )}
        </div>

        {leave.status !== LeaveStatus.PENDING && (
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Processing Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leave.approvedBy && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Processed By</p>
                  <p className="font-medium">{leave.approvedBy}</p>
                  <p className="text-sm text-gray-500">{leave.approverType}</p>
                </div>
              )}

              {leave.approvalDate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Processed On</p>
                  <p className="font-medium">
                    {formatDate(leave.approvalDate)}
                  </p>
                </div>
              )}
            </div>

            {leave.comments && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Comments
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{leave.comments}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {leave.affectedClasses && leave.affectedClasses.length > 0 && (
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Affected Classes
            </h3>
            <div className="flex flex-wrap gap-2">
              {leave.affectedClasses.map((cls, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm"
                >
                  {cls}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Request Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Requested By</p>
              <p className="font-medium">{leave.requestedByParent}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="font-medium">
                {format(new Date(leave.createdAt), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
          </div>
        </div>

        {leave.status === LeaveStatus.PENDING && (
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-end">
              <button
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                onClick={handleCancelLeave}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✗</span>
                    Cancel Leave Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
