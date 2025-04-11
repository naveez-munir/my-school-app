import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { useFileUpload } from '~/hooks/useFileQueries';
import toast from 'react-hot-toast';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (url: string) => void;
  folder?: string;
}

export function PhotoUpload({ currentPhoto, onPhotoChange, folder = 'photos' }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentPhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFileAsync, isPending } = useFileUpload();
  const [toastId, setToastId] = useState<string | null>(null);

  useEffect(() => {
    setPreview(currentPhoto);
  }, [currentPhoto]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const id = toast.loading('Uploading photo...');
      setToastId(id);
      
      const result = await uploadFileAsync({ file, folder });

      onPhotoChange(result.url);
      
      toast.success('Photo uploaded successfully', { id });
      setToastId(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      if (toastId) {
        toast.error('Failed to upload photo. Please try again.', { id: toastId });
        setToastId(null);
      }

      if (currentPhoto) {
        setPreview(currentPhoto);
      } else {
        setPreview(undefined);
      }
    }
  };

  const handleRemovePhoto = () => {
    setPreview(undefined);
    onPhotoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 rounded-full object-cover"
            />
            {isPending && (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                <Loader className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={isPending}
              className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => !isPending && fileInputRef.current?.click()}
            className={`h-32 w-32 rounded-full border-2 border-dashed ${
              isPending ? 'border-gray-200 cursor-not-allowed' : 'border-gray-300 cursor-pointer hover:border-gray-400'
            } flex items-center justify-center`}
          >
            {isPending ? (
              <Loader className="h-8 w-8 text-gray-400 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        disabled={isPending}
        className="hidden"
      />
    </div>
  );
}
