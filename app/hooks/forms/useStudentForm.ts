import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useStudent } from '~/hooks/useStudentQueries';
import toast from 'react-hot-toast';
import { cleanFormData } from '~/utils/cleanFormData';
import { getErrorMessage } from '~/utils/error';

export function useStudentForm<TFormData, TMutationData = TFormData>({
  initialDataMapper,
  defaultData,
  mutationHook,
  onSuccess,
  redirectPath,
  transformOnSubmit,
  successMessage = 'Changes saved successfully',
  entityName = 'Student information',
}: {
  initialDataMapper: (student: any) => TFormData;
  defaultData: TFormData;
  mutationHook: any;
  onSuccess?: (data: TFormData) => void;
  redirectPath?: string | ((id: string) => string);
  transformOnSubmit?: (formData: TFormData) => TMutationData;
  successMessage?: string;
  entityName?: string;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { 
    data: student, 
    isLoading: isLoadingStudent, 
    error: studentError 
  } = useStudent(id || '');

  const mutation = mutationHook();
  
  const [formData, setFormData] = useState<TFormData>(defaultData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (student) {
      const initialData = initialDataMapper(student);
      setFormData(initialData);
    }
  }, [student]);

  const handleChange = <K extends keyof TFormData>(field: K, value: TFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (dataOrEvent?: TFormData | React.FormEvent) => {
    // Check if it's an event or data
    const isEvent = dataOrEvent && typeof dataOrEvent === 'object' && 'preventDefault' in dataOrEvent;

    if (isEvent) {
      (dataOrEvent as React.FormEvent).preventDefault();
    }

    if (!id) return;

    const toastId = toast.loading(`Saving ${entityName.toLowerCase()}...`);

    try {
      setIsSubmitting(true);
      // Use passed data if available, otherwise use formData from state
      const dataToUse = !isEvent && dataOrEvent ? dataOrEvent as TFormData : formData;
      const dataToSubmit = transformOnSubmit
        ? transformOnSubmit(dataToUse)
        : dataToUse as unknown as TMutationData;
      // Clean the data to remove null, undefined, and empty string values
      const cleanedData = cleanFormData(dataToSubmit);
      await mutation.mutateAsync({
        id,
        data: cleanedData
      });
      if (onSuccess) {
        onSuccess(dataToUse);
      }

      toast.success(successMessage, { id: toastId, duration: 5000 });

      if (redirectPath) {
        const path = typeof redirectPath === 'function'
          ? redirectPath(id)
          : redirectPath;
        navigate(path);
      } else {
        navigate(`/dashboard/students/${id}`);
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      toast.error(getErrorMessage(error), { id: toastId, duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    id,
    student,
    formData,
    isLoadingStudent,
    isSubmitting,
    isPending: isSubmitting || mutation.isPending,
    error: studentError || mutation.error,
    setFormData,
    handleChange,
    handleSubmit,
    navigate,
  };
}
