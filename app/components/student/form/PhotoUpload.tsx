import { Upload, X, Loader } from 'lucide-react';
import { useFileUploadWithPreview } from '~/hooks/useFileUploadWithPreview';
import type { PhotoUploadProps } from '~/types/student';

export function PhotoUpload({ currentPhoto, onPhotoChange, folder = 'photos' }: PhotoUploadProps) {
  const {
    preview,
    isPending,
    fileInputRef,
    handleFileChange,
    handleRemove
  } = useFileUploadWithPreview({
    initialUrl: currentPhoto,
    folder,
    onUploadSuccess: onPhotoChange,
    enablePreview: true,
    uploadingMessage: 'Uploading photo...',
    successMessage: 'Photo uploaded successfully',
    errorMessage: 'Failed to upload photo. Please try again.'
  });

  const handleRemovePhoto = () => {
    handleRemove();
    onPhotoChange('');
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
