import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { Gender, BloodGroup, type UpdatePersonalInfoDto } from '~/types/student';
import { useUpdatePersonalInfo, useStudent } from '~/hooks/useStudentQueries';

export function PersonalInfoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading: isLoadingStudent } = useStudent(id || '');
  const updateMutation = useUpdatePersonalInfo();

  const getInitialFormData = (): UpdatePersonalInfoDto => {
    if (!student) {
      return {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: Gender.Male,
        bloodGroup: undefined,
        photoUrl: null,
        phone: null,
        email: null,
        address: '',
      };
    }

    return {
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || Gender.Male,
      bloodGroup: student.bloodGroup,
      photoUrl: student.photoUrl,
      phone: student.phone,
      email: student.email,
      address: student.address || '',
    };
  };

  const [formData, setFormData] = useState<UpdatePersonalInfoDto>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (student) {
      setFormData(getInitialFormData());
    }
  }, [student]);

  const handleChange = (field: keyof UpdatePersonalInfoDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateMutation.mutateAsync({ 
        id, 
        data: formData 
      });
      navigate(`/dashboard/students/${id}`);
    } catch (error) {
      console.error('Failed to update student personal info:', error);
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
        <h1 className="text-2xl font-semibold text-gray-900">Edit Personal Information</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update personal details for {student.firstName} {student.lastName}.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="First Name"
              value={formData.firstName || ''}
              onChange={(value) => handleChange('firstName', value)}
              required
            />

            <TextInput
              label="Last Name"
              value={formData.lastName || ''}
              onChange={(value) => handleChange('lastName', value)}
              required
            />

            <DateInput
              label="Date of Birth"
              value={formData.dateOfBirth || ''}
              onChange={(value) => handleChange('dateOfBirth', value)}
              required
            />

            <SelectInput<typeof Gender>
              label="Gender"
              value={formData.gender || Gender.Male}
              onChange={(value) => handleChange('gender', value)}
              options={Gender}
              placeholder="Select Gender"
              required
            />

            <SelectInput<typeof BloodGroup>
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(value) => handleChange('bloodGroup', value)}
              options={BloodGroup}
              placeholder="Select Blood Group"
            />

            <TextInput
              label="Phone"
              value={formData.phone || ''}
              onChange={(value) => handleChange('phone', value)}
              type="tel"
            />

            <TextInput
              label="Email"
              value={formData.email || ''}
              onChange={(value) => handleChange('email', value)}
              type="email"
            />

            <div className="md:col-span-2">
              <TextArea
                label="Address"
                value={formData.address || ''}
                onChange={(value) => handleChange('address', value)}
                rows={3}
              />
            </div>
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
