import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useStudent } from '~/hooks/useStudentQueries';
import toast from 'react-hot-toast';

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!id) return;
    
    const toastId = toast.loading(`Saving ${entityName.toLowerCase()}...`);
    
    try {
      setIsSubmitting(true);
      const dataToSubmit = transformOnSubmit 
        ? transformOnSubmit(formData)
        : formData as unknown as TMutationData;
      await mutation.mutateAsync({
        id,
        data: dataToSubmit
      });
      if (onSuccess) {
        onSuccess(formData);
      }
      
      toast.success(successMessage, { id: toastId });
      
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
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to save ${entityName.toLowerCase()}`;
      
      toast.error(errorMessage, { id: toastId });
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
