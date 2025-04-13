import { useMutation, useQuery } from '@tanstack/react-query';
import { fileApi } from '~/services/fileApi';
import { useState } from 'react';

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const mutation = useMutation({
    mutationFn: ({ file, folder, isPrivate = false }: { 
      file: File; 
      folder?: string; 
      isPrivate?: boolean 
    }) => {
      return fileApi.upload(file, folder, isPrivate);
    },
    onMutate: () => {
      setUploadProgress(0);
    }
  });

  return {
    ...mutation,
    uploadProgress,
    uploadFile: mutation.mutate,
    uploadFileAsync: mutation.mutateAsync
  };
};

export const useFileUrl = (key: string, expiresIn: number = 3600) => {
  return useQuery({
    queryKey: ['files', 'url', key, expiresIn],
    queryFn: () => fileApi.getSignedUrl(key, expiresIn),
    enabled: !!key,
  });
};

export const useFileDelete = () => {
  return useMutation({
    mutationFn: (key: string) => fileApi.delete(key),
  });
};

export const useFilesList = (folder: string) => {
  return useQuery({
    queryKey: ['files', 'list', folder],
    queryFn: () => fileApi.listFiles(folder),
    enabled: !!folder,
  });
};
