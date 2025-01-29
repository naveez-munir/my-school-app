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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFileAsync, isPending } = useFileUpload();

  // Sync with initial URL changes
  useEffect(() => {
    setFileUrl(initialUrl);
    setPreview(initialUrl);
  }, [initialUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generate preview for images if enabled
    if (enablePreview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    try {
      const toastId = toast.loading(uploadingMessage);
      const result = await uploadFileAsync({ file, folder });

      setFileUrl(result.url);
      if (!enablePreview) {
        setPreview(result.url);
      }
      
      onUploadSuccess?.(result.url);
      toast.success(successMessage, { id: toastId });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(errorMessage, { duration: 4000 });
      
      // Revert to initial state on error
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
    fileInputRef,
    handleFileChange,
    handleRemove,
    setFileUrl
  };
}

