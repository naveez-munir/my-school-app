import { useState } from 'react';
import { ExceptionList } from '~/components/timetable/exceptions/ExceptionList';
import { ExceptionForm } from '~/components/timetable/exceptions/ExceptionForm';
import { useCreateException, useUpdateException } from '~/hooks/useExceptionQueries';
import toast from 'react-hot-toast';
import type { TimetableException, CreateExceptionDto } from '~/types/timetable';

export function meta() {
  return [
    { title: "Exceptions & Substitutions" },
    { name: "description", content: "Manage schedule exceptions and teacher substitutions" },
  ];
}

export default function ExceptionsPage() {
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    exception?: TimetableException;
  }>({ isOpen: false });

  const createExceptionMutation = useCreateException();
  const updateExceptionMutation = useUpdateException();

  const handleCreateNew = () => {
    setFormModal({ isOpen: true, exception: undefined });
  };

  const handleEdit = (exception: TimetableException) => {
    setFormModal({ isOpen: true, exception });
  };

  const handleSave = (data: CreateExceptionDto) => {
    if (formModal.exception) {
      updateExceptionMutation.mutate(
        { id: formModal.exception.id, data },
        {
          onSuccess: () => {
            toast.success('Exception updated successfully');
            setFormModal({ isOpen: false });
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update exception');
          }
        }
      );
    } else {
      createExceptionMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Exception created successfully');
          setFormModal({ isOpen: false });
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to create exception');
        }
      });
    }
  };

  return (
    <>
      <ExceptionList
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
      />

      <ExceptionForm
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false })}
        onSave={handleSave}
        existingException={formModal.exception}
      />
    </>
  );
}

