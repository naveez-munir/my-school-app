import { useState } from 'react';
import { useActionData, useNavigation, useSubmit } from 'react-router';
import type { CreateSubjectDto, UpdateSubjectDto } from '~/types/subject';

export function useSubjects() {
  const [searchParams, setSearchParams] = useState({
    subjectName: '',
    subjectCode: ''
  });
  
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData();

  const isLoading = navigation.state === 'submitting';

  const handleCreate = (data: CreateSubjectDto) => {
    const formData = new FormData();
    formData.append('action', 'create');
    formData.append('payload', JSON.stringify(data));
    
    submit(formData, { method: 'POST' });
  };

  const handleUpdate = (id: string, data: UpdateSubjectDto) => {
    submit({
      action: 'update',
      payload: { id, ...data }
    }, { method: 'PUT' });
  };

  const handleDelete = (id: string) => {
    submit({
      action: 'delete',
      payload: { id }
    }, { method: 'DELETE' });
  };

  const handleSearch = (params: typeof searchParams) => {
    setSearchParams(params);
  };

  return {
    searchParams,
    isLoading,
    actionData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSearch
  };
}
