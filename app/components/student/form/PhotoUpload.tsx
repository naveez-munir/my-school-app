// components/form/PhotoUpload.tsx
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (url: string) => void;
}

export function PhotoUpload({ currentPhoto, onPhotoChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentPhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Here you would typically upload the file to your server
    // and get back a URL. For now, we'll just use the preview
    // TODO: Implement actual file upload
    onPhotoChange(preview || '');
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
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-32 w-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400"
          >
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
