import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface FileInputProps {
  value?: string;
  onChange: (value: string) => void;
  accept?: string;
  label?: string;
  required?: boolean;
}

export function FileInput({
  value,
  onChange,
  accept = '.pdf,.png,.jpg,.jpeg',
  label = 'Upload File',
  required = false
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Log detailed file information
      console.log('File Details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        // This won't work, but logging for demonstration
        path: (file as any).path 
      });

      // For Chromium-based browsers in development
      if ((file as any).path) {
        onChange((file as any).path);
      } else {
        // Fallback to filename
        onChange(file.name);
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && '*'}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          // Allow multiple files if needed
          multiple={false}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </button>
        
        {value && (
          <div className="flex items-center space-x-2">
            <span className="text-sm truncate max-w-[200px]">{value}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
