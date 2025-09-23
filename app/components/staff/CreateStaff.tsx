import { useCreateStaff } from '~/hooks/useStaffQueries';
import { StaffForm } from './StaffForm';
import type { CreateStaffRequest } from '~/types/staff';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { getErrorMessage } from '~/utils/error';
import { cleanStaffData } from '~/utils/cleanFormData';

export function CreateStaff() {
  const navigate = useNavigate();
  const createStaffMutation = useCreateStaff();

  const handleSubmit = (data: CreateStaffRequest) => {
    const cleanedData = cleanStaffData(data);
    
    createStaffMutation.mutate(
      cleanedData as CreateStaffRequest,
      {
        onSuccess: () => {
          toast.success('Staff member created successfully');
          navigate('/dashboard/staff');
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        }
      }
    );
  };

  const handleCancel = () => {
    navigate('/dashboard/staff');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Staff Member</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new staff member profile with their personal and professional information.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <StaffForm
            onSubmit={handleSubmit}
            isLoading={createStaffMutation.isPending}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

