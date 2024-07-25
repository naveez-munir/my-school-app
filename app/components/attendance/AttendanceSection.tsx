import { useState } from 'react';
import { useAttendanceRecords, useDeleteAttendance, useUpdateAttendance, useBatchCheckout } from '~/hooks/useAttendanceQueries';
import {
  type AttendanceRecord,
  AttendanceType,
  AttendanceStatus
} from '~/types/attendance';
import { AttendanceTable } from '~/components/attendance/AttendanceTable';
import { useNavigate } from 'react-router';
import { SelectInput } from '../common/form/inputs/SelectInput';
import { DateInput } from '../common/form/inputs/DateInput';
import { ClassSelector } from '../common/ClassSelector';
import { StudentSelector } from '../common/StudentSelector';
import { PlusCircle } from 'lucide-react';
import { Modal } from '~/components/common/Modal';
import toast from 'react-hot-toast';
import { getErrorMessage } from '~/utils/error';

export function AttendanceSection() {
  const [userType, setUserType] = useState<AttendanceType | undefined>(AttendanceType.STUDENT);
  const [classId, setClassId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [status, setStatus] = useState<AttendanceStatus | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; attendanceId?: string; userName?: string }>({
    isOpen: false
  });
  const [checkoutModal, setCheckoutModal] = useState<{ isOpen: boolean; attendanceId?: string; userName?: string }>({
    isOpen: false
  });
  const [batchCheckoutModal, setBatchCheckoutModal] = useState<{ isOpen: boolean; count: number }>({
    isOpen: false,
    count: 0
  });
  const navigate = useNavigate();

  const queryParams = {
    ...(userType && { userType }),
    ...(classId && { classId }),
    ...(userId && { userId }),
    ...(status && { status }),
    ...(startDate && { startDate: new Date(startDate).toISOString() }),
    ...(endDate && { endDate: new Date(endDate).toISOString() }),
    page,
    limit
  };

  const { data: response, isLoading, isError, refetch } = useAttendanceRecords(queryParams);

  // Extract data and meta from paginated response
  const data = response?.data || [];
  const meta = response?.meta;

  // Temporary log to debug
  if (!isLoading && response) {
    console.log('Response received:', { response, data, meta, dataLength: data.length });
  }
  const deleteAttendanceMutation = useDeleteAttendance();
  const updateAttendanceMutation = useUpdateAttendance();
  const batchCheckoutMutation = useBatchCheckout();

  const handleViewDetails = (record: AttendanceRecord) => {
    navigate(`/dashboard/attendance/${record.id}`);
  };
  
  const handleEdit = (record: AttendanceRecord) => {
    navigate(`/dashboard/attendance/${record.id}/edit`);
  };
  
  const handleDeleteClick = (id: string) => {
    const record = data?.find(r => r.id === id);
    setDeleteModal({
      isOpen: true,
      attendanceId: id,
      userName: record?.user.name
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.attendanceId) {
      deleteAttendanceMutation.mutate(deleteModal.attendanceId, {
        onSuccess: () => {
          toast.success('Attendance record deleted successfully');
          setDeleteModal({ isOpen: false });
          refetch();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          setDeleteModal({ isOpen: false });
        }
      });
    }
  };

  const handleCheckout = (id: string) => {
    const record = data?.find(r => r.id === id);
    setCheckoutModal({
      isOpen: true,
      attendanceId: id,
      userName: record?.user.name
    });
  };

  const handleCheckoutConfirm = () => {
    if (checkoutModal.attendanceId) {
      const now = new Date();
      const checkOutTime = now.toTimeString().slice(0, 5);

      updateAttendanceMutation.mutate(
        {
          id: checkoutModal.attendanceId,
          data: { checkOutTime }
        },
        {
          onSuccess: () => {
            toast.success(`${checkoutModal.userName} checked out successfully`);
            setCheckoutModal({ isOpen: false });
            refetch();
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
            setCheckoutModal({ isOpen: false });
          }
        }
      );
    }
  };

  const handleAddAttendance = () => {
    navigate('/dashboard/attendance/new');
  };

  const handleBatchCheckout = () => {
    const recordsToCheckout = data?.filter(record =>
      !record.checkOutTime && (record.status === 'present' || record.status === 'late')
    ) || [];

    setBatchCheckoutModal({
      isOpen: true,
      count: recordsToCheckout.length
    });
  };

  const handleBatchCheckoutConfirm = () => {
    const recordsToCheckout = data?.filter(record =>
      !record.checkOutTime && (record.status === 'present' || record.status === 'late')
    ) || [];

    const attendanceIds = recordsToCheckout.map(record => record.id);

    batchCheckoutMutation.mutate(
      { attendanceIds },
      {
        onSuccess: (response) => {
          toast.success(`Successfully checked out ${response.updatedCount} records`);
          setBatchCheckoutModal({ isOpen: false, count: 0 });
          refetch();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          setBatchCheckoutModal({ isOpen: false, count: 0 });
        }
      }
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xs sm:text-sm lg:text-base font-bold">Attendance Records</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard/attendance/reports')}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
          >
            <span>Reports</span>
          </button>
          <button
            onClick={handleBatchCheckout}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm"
            disabled={!data?.some(record => !record.checkOutTime && (record.status === 'present' || record.status === 'late'))}
          >
            <span>Batch Checkout</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/attendance/batch')}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm"
          >
            <PlusCircle size={18} />
            <span>Batch Attendance</span>
          </button>
          <button
            onClick={handleAddAttendance}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
          >
            <PlusCircle size={18} />
            <span>Add Single</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xs sm:text-sm mb-4">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <SelectInput<typeof AttendanceType>
            label="User Type"
            value={userType}
            onChange={(value) => {
              // Convert the key to the actual enum value
              const newUserType = AttendanceType[value as keyof typeof AttendanceType] || undefined;
              setUserType(newUserType);
              setUserId('');
              if (newUserType === AttendanceType.TEACHER || newUserType === AttendanceType.STAFF) {
                setClassId('');
              }
              setPage(1);
            }}
            options={AttendanceType}
            placeholder="All Types"
          />

          {userType === AttendanceType.STUDENT && (
            <ClassSelector
              label="Select Class"
              value={classId}
              onChange={(value) => {
                setClassId(value);
                setUserId('');
                setPage(1);
              }}
              placeholder="All Classes"
            />
          )}

          {userType === AttendanceType.STUDENT && classId && (
            <StudentSelector
              label="Select Student"
              value={userId}
              onChange={(value) => {
                setUserId(value);
                setPage(1);
              }}
              classId={classId}
              placeholder="All Students"
            />
          )}

          {userType === AttendanceType.STUDENT && !classId && (
            <StudentSelector
              label="Select Student"
              value={userId}
              onChange={(value) => {
                setUserId(value);
                setPage(1);
              }}
              placeholder="All Students"
            />
          )}

          <SelectInput<typeof AttendanceStatus>
            label="Status"
            value={status}
            onChange={(value) => {
              // Convert the key to the actual enum value
              const newStatus = AttendanceStatus[value as keyof typeof AttendanceStatus] || undefined;
              setStatus(newStatus);
              setPage(1);
            }}
            options={AttendanceStatus}
            placeholder="All Statuses"
          />

          <DateInput
            label="Start Date"
            value={startDate}
            onChange={(value) => {
              setStartDate(value);
              setPage(1);
            }}
            placeholder="From"
          />

          <DateInput
            label="End Date"
            value={endDate}
            onChange={(value) => {
              setEndDate(value);
              setPage(1);
            }}
            placeholder="To"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Attendance Records</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {meta ? `${meta.totalItems} records found` : ''}
            </span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="block rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading attendance records...
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500 border rounded-md">
            Error loading attendance records. Please try again.
          </div>
        ) : data && data.length > 0 ? (
          <>
            <AttendanceTable
              data={data}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onCheckout={handleCheckout}
              userType={userType}
            />

            {meta && meta.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-700">
                  Page {meta.currentPage} of {meta.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!meta.hasPreviousPage}
                    className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!meta.hasNextPage}
                    className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 border rounded-md">
            No attendance records found with the current filters.
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Attendance"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <div className="h-5 w-5 text-red-600">🗑️</div>
            <p className="text-sm text-red-800">
              This action cannot be undone. This will permanently delete the attendance record.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete attendance for <strong>{deleteModal.userName}</strong>?
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setDeleteModal({ isOpen: false })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteAttendanceMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleteAttendanceMutation.isPending ? 'Deleting...' : 'Delete Attendance'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={checkoutModal.isOpen}
        onClose={() => setCheckoutModal({ isOpen: false })}
        title="Confirm Checkout"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to check out <strong>{checkoutModal.userName}</strong>?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setCheckoutModal({ isOpen: false })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCheckoutConfirm}
              disabled={updateAttendanceMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {updateAttendanceMutation.isPending ? 'Checking out...' : 'Confirm Checkout'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={batchCheckoutModal.isOpen}
        onClose={() => setBatchCheckoutModal({ isOpen: false, count: 0 })}
        title="Batch Checkout"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will check out <strong>{batchCheckoutModal.count}</strong> attendance record(s) that are currently present or late without checkout time.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setBatchCheckoutModal({ isOpen: false, count: 0 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBatchCheckoutConfirm}
              disabled={batchCheckoutMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {batchCheckoutMutation.isPending ? 'Checking out...' : 'Confirm Batch Checkout'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
