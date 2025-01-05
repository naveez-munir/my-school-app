import { useNavigate } from 'react-router';
import { BulkResultEntryForm } from '~/components/examSection/examResult/BulkResultEntryForm';
import { useCreateBulkResults } from '~/hooks/useExamResultQueries';
import { useMyTeachingExams, useExams } from '~/hooks/useExamQueries';
import type { BulkResultInput } from '~/types/examResult';
import type { Route } from "../../+types.exams";
import toast from 'react-hot-toast';
import { getUserRole } from '~/utils/auth';
import { UserRoleEnum } from '~/types/user';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bulk Result Entry" },
    { name: "description", content: "Add exam results for multiple students at once" },
  ];
}

export default function BulkResultEntry() {
  const navigate = useNavigate();
  const createBulkMutation = useCreateBulkResults();

  const userRole = getUserRole();
  const isTeacher = userRole?.role === UserRoleEnum.TEACHER;
  const isAdmin = userRole?.role === UserRoleEnum.TENANT_ADMIN;
  const shouldFetchTeachingExams = isTeacher && !isAdmin;

  const { data: allExams = [] } = useExams({}, { enabled: !shouldFetchTeachingExams });
  const { data: teachingExams = [] } = useMyTeachingExams({ enabled: shouldFetchTeachingExams });
  const exams = shouldFetchTeachingExams ? teachingExams : allExams;

  const handleSubmit = (data: BulkResultInput) => {
    createBulkMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.failureCount > 0) {
          toast.success(
            `${response.successCount} results created successfully. ${response.failureCount} failed.`,
            { duration: 5000 }
          );
        } else {
          toast.success(response.message);
        }
        navigate('/dashboard/exams/results');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create results';
        toast.error(errorMessage);
        console.error('Failed to create bulk results:', error);
      }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/exams/results');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Exam Result Entry</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter exam results for multiple students at once
        </p>
      </div>

      <BulkResultEntryForm
        exams={exams}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createBulkMutation.isPending}
      />
    </div>
  );
}
