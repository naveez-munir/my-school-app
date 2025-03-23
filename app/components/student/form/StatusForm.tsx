import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { StudentStatus, ExitStatus, type UpdateStatusDto } from '~/types/student';
import { useUpdateStudentStatus, useStudent } from '~/hooks/useStudentQueries';

export function StatusForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading: isLoadingStudent } = useStudent(id || '');
  const updateMutation = useUpdateStudentStatus();

  const getInitialFormData = (): UpdateStatusDto => {
    if (!student) {
      return {
        status: StudentStatus.Active,
        exitStatus: ExitStatus.None,
        exitDate: null,
        exitRemarks: null
      };
    }

    return {
      status: student.status || StudentStatus.Active,
      exitStatus: student.exitStatus || ExitStatus.None,
      exitDate: student.exitDate || null,
      exitRemarks: student.exitRemarks || null
    };
  };

  const [formData, setFormData] = useState<UpdateStatusDto>(getInitialFormData());
  const [showExitFields, setShowExitFields] = useState<boolean>(
    formData.exitStatus !== ExitStatus.None
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (student) {
      setFormData(getInitialFormData());
    }
  }, [student]);

  useEffect(() => {
    setShowExitFields(formData.exitStatus !== ExitStatus.None);
  }, [formData.exitStatus]);

  const handleChange = (field: keyof UpdateStatusDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    // If exit status is None, clear the exit date and remarks
    const dataToSubmit: UpdateStatusDto = {
      ...formData,
      exitDate: formData.exitStatus === ExitStatus.None ? null : formData.exitDate,
      exitRemarks: formData.exitStatus === ExitStatus.None ? null : formData.exitRemarks
    };
    
    try {
      setIsSubmitting(true);
      await updateMutation.mutateAsync({
        id,
        data: dataToSubmit
      });
      navigate(`/dashboard/students/${id}`);
    } catch (error) {
      console.error('Failed to update student status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStudent) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Student not found</h3>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/dashboard/students')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to students list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Student Status</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update status information for {student.firstName} {student.lastName}.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectInput<typeof StudentStatus>
              label="Student Status"
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              options={StudentStatus}
              placeholder="Select Status"
              required
            />

            <SelectInput<typeof ExitStatus>
              label="Exit Status"
              value={formData.exitStatus || ExitStatus.None}
              onChange={(value) => handleChange('exitStatus', value)}
              options={ExitStatus}
              placeholder="Select Exit Status"
            />

            {showExitFields && (
              <>
                <DateInput
                  label="Exit Date"
                  value={formData.exitDate || ''}
                  onChange={(value) => handleChange('exitDate', value)}
                  required={showExitFields}
                />

                <div className="md:col-span-2">
                  <TextArea
                    label="Exit Remarks"
                    value={formData.exitRemarks || ''}
                    onChange={(value) => handleChange('exitRemarks', value)}
                    rows={3}
                    placeholder="Reason for leaving the school"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/students/${id}`)}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting || updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
