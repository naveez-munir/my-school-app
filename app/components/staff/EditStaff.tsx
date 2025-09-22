import { useState } from 'react';
import { useStaff, useUpdateStaff } from '~/hooks/useStaffQueries';
import { StaffForm } from './StaffForm';
import type { UpdateStaffRequest } from '~/types/staff';
import { useNavigate, useParams } from 'react-router';
import { cleanStaffData } from '~/utils/cleanFormData';
import toast from 'react-hot-toast';
import { getErrorMessage } from '~/utils/error';
import { LeaveBalanceTab } from '~/components/leave/LeaveBalanceTab';
import { isAdmin } from '~/utils/auth';

export function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'basic' | 'leave'>('basic');
  const userIsAdmin = isAdmin();
  
  const { data: currentStaff, isLoading: fetchLoading } = useStaff(id || '');
  const updateStaffMutation = useUpdateStaff();

  const handleSubmit = (data: UpdateStaffRequest) => {
    if (id) {
      const cleanedData = cleanStaffData(data);
      updateStaffMutation.mutate(
        { id, data: cleanedData },
        {
          onSuccess: () => {
            toast.success('Staff member updated successfully');
            navigate('/dashboard/staff');
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          }
        }
      );
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/staff');
  };

  if (fetchLoading || !currentStaff) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Staff Member</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update staff member information and credentials.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex-shrink-0">
              {currentStaff.photoUrl ? (
                <img 
                  src={currentStaff.photoUrl} 
                  alt={`${currentStaff.firstName} ${currentStaff.lastName}`}
                  className="h-24 w-24 object-cover rounded-full border-4 border-white shadow"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow">
                  <span className="text-2xl font-medium text-gray-600">
                    {currentStaff.firstName?.[0]}{currentStaff.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{currentStaff.firstName} {currentStaff.lastName}</h2>
              <div className="mt-2 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <span className="text-sm text-gray-900">{currentStaff.cniNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      currentStaff.employmentStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                      currentStaff.employmentStatus === 'OnLeave' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentStaff.employmentStatus === 'OnLeave' ? 'On Leave' : currentStaff.employmentStatus}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  {currentStaff.email && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <span className="text-sm text-gray-900">{currentStaff.email}</span>
                    </div>
                  )}
                  {currentStaff.phone && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <span className="text-sm text-gray-900">{currentStaff.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-500">Designation:</span>
                    <span className="text-sm font-medium text-blue-700">
                      {currentStaff.designation}
                    </span>
                  </div>
                  {currentStaff.department && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Department:</span>
                      <span className="text-sm text-gray-900">{currentStaff.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Basic Info
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'leave'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏖️ Leave Balance
            </button>
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'basic' ? (
            <StaffForm
              initialData={currentStaff}
              onSubmit={handleSubmit}
              isLoading={updateStaffMutation.isPending}
              onCancel={handleCancel}
            />
          ) : (
            <LeaveBalanceTab
              employeeId={id || ''}
              employeeType="Staff"
              isAdmin={userIsAdmin}
            />
          )}
        </div>
      </div>
    </div>
  );
}

