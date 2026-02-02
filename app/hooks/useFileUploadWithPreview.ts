import { useState, useRef, useEffect } from 'react';
import { useFileUpload } from '~/hooks/useFileQueries';
import toast from 'react-hot-toast';

export interface UseFileUploadWithPreviewOptions {
  initialUrl?: string;
  folder?: string;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: unknown) => void;
  enablePreview?: boolean;
  uploadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface UseFileUploadWithPreviewReturn {
  fileUrl: string | undefined;
  preview: string | undefined;
  isPending: boolean;
  uploadProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemove: () => void;
  setFileUrl: (url: string | undefined) => void;
}

export function useFileUploadWithPreview({
  initialUrl,
  folder = 'uploads',
  onUploadSuccess,
  onUploadError,
  enablePreview = false,
  uploadingMessage = 'Uploading file...',
  successMessage = 'File uploaded successfully',
  errorMessage = 'Failed to upload file. Please try again.'
}: UseFileUploadWithPreviewOptions = {}): UseFileUploadWithPreviewReturn {
  const [fileUrl, setFileUrl] = useState<string | undefined>(initialUrl);
  const [preview, setPreview] = useState<string | undefined>(initialUrl);
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFileAsync, isPending, uploadProgress } = useFileUpload();

  // Sync with initial URL changes
  useEffect(() => {
    setFileUrl(initialUrl);
    setPreview(initialUrl);
  }, [initialUrl]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cleanup previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    // Generate instant preview for images using URL.createObjectURL (synchronous)
    if (enablePreview && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setPreview(objectUrl);
    }

    try {
      const toastId = toast.loading(uploadingMessage);

      // Pass oldUrl (fileUrl) to backend so it can delete the old file after successful upload
      const result = await uploadFileAsync({
        file,
        folder,
        oldUrl: fileUrl
      });

      setFileUrl(result.url);
      // Update preview to actual URL and cleanup object URL
      setPreview(result.url);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      onUploadSuccess?.(result.url);
      toast.success(successMessage, { id: toastId });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(errorMessage, { duration: 4000 });

      // Cleanup object URL and revert to initial state on error
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setFileUrl(initialUrl);
      setPreview(initialUrl);

      onUploadError?.(error);
    }
  };

  const handleRemove = () => {
    setFileUrl(undefined);
    setPreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    fileUrl,
    preview,
    isPending,
    uploadProgress,
    fileInputRef,
    handleFileChange,
    handleRemove,
    setFileUrl
  };
}

