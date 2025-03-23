import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { GuardianRelationship, type Guardian, type UpdateGuardianInfoDto } from '~/types/student';
import { useStudent, useUpdateGuardianInfo } from '~/hooks/useStudentQueries';
import { FormActions } from '~/components/common/form/FormActions';
import { GuardianFormFields } from './GuardianFormFields';

export function GuardianInfoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading: isLoadingStudent } = useStudent(id || '');
  const updateMutation = useUpdateGuardianInfo();

  const getInitialFormData = (): Guardian => {
    if (!student?.guardian) {
      return {
        name: '',
        cniNumber: '',
        relationship: GuardianRelationship.Father,
        phone: '',
        email: null,
      };
    }

    return {
      name: student.guardian.name || '',
      cniNumber: student.guardian.cniNumber || '',
      relationship: student.guardian.relationship || GuardianRelationship.Father,
      phone: student.guardian.phone || '',
      email: student.guardian.email || null,
    };
  };

  const [formData, setFormData] = useState<Guardian>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (student?.guardian) {
      setFormData(getInitialFormData());
    }
  }, [student]);

  const handleChange = <K extends keyof Guardian>(field: K, value: Guardian[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateMutation.mutateAsync({
        id,
        data: {
          guardian: formData
        }
      });
      navigate(`/dashboard/students/${id}`);
    } catch (error) {
      console.error('Failed to update guardian info:', error);
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
        <h1 className="text-2xl font-semibold text-gray-900">Edit Guardian Information</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update guardian details for {student.firstName} {student.lastName}.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-6">
          <GuardianFormFields
            data={formData} 
            onChange={handleChange} 
          />

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <FormActions
              onCancel={() => navigate(`/dashboard/students/${id}`)}
              onSubmit={handleSubmit}
              isLoading={isSubmitting || updateMutation.isPending}
              mode="edit"
              entityName="Guardian"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
