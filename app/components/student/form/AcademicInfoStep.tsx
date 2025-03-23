import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { ClassSelector } from '~/components/common/ClassSelector';
import { GradeLevel, type UpdateAcademicInfoDto } from '~/types/student';
import { useUpdateAcademicInfo, useStudent } from '~/hooks/useStudentQueries';

export function AcademicInfoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading: isLoadingStudent } = useStudent(id || '');
  const updateMutation = useUpdateAcademicInfo();

  const getInitialFormData = (): UpdateAcademicInfoDto => {
    if (!student) {
      return {
        class: null,
        rollNumber: null,
        gradeLevel: '',
        enrollmentDate: null
      };
    }

    return {
      class: student.class,
      rollNumber: student.rollNumber,
      gradeLevel: student.gradeLevel || '',
      enrollmentDate: student.enrollmentDate || null
    };
  };

  const [formData, setFormData] = useState<UpdateAcademicInfoDto>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (student) {
      setFormData(getInitialFormData());
    }
  }, [student]);

  const handleChange = (field: keyof UpdateAcademicInfoDto, value: any) => {
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
      console.error('Failed to update academic info:', error);
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
        <h1 className="text-2xl font-semibold text-gray-900">Edit Academic Information</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update academic details for {student.firstName} {student.lastName}.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectInput<typeof GradeLevel>
              label="Grade Level"
              value={formData.gradeLevel as GradeLevel}
              onChange={(value) => handleChange('gradeLevel', value)}
              options={GradeLevel}
              placeholder="Select Grade Level"
              required
            />

            <ClassSelector
              value={formData.class || ''}
              onChange={(classId) => handleChange('class', classId)}
              label="Class"
            />

            <TextInput
              label="Roll Number"
              value={formData.rollNumber || ''}
              onChange={(value) => handleChange('rollNumber', value)}
            />

            <DateInput
              label="Enrollment Date"
              value={formData.enrollmentDate || ''}
              onChange={(value) => handleChange('enrollmentDate', value)}
            />
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
