import { File, Upload, Loader, Download, FileText, X } from 'lucide-react';
import { useFileUploadWithPreview } from '~/hooks/useFileUploadWithPreview';
import type { DocumentUploaderProps } from '~/types/student';

export function DocumentUploader({
  currentDocumentUrl,
  documentType,
  onDocumentChange,
  folder = 'documents',
  label = 'Upload Document',
  accept = "image/*,.pdf,.doc,.docx"
}: DocumentUploaderProps) {
  const {
    fileUrl: documentUrl,
    isPending,
    fileInputRef,
    handleFileChange,
    handleRemove
  } = useFileUploadWithPreview({
    initialUrl: currentDocumentUrl,
    folder,
    onUploadSuccess: onDocumentChange,
    enablePreview: false,
    uploadingMessage: 'Uploading document...',
    successMessage: 'Document uploaded successfully',
    errorMessage: 'Failed to upload document. Please try again.'
  });

  const getDocumentType = (url: string): 'image' | 'pdf' | 'other' => {
    if (!url) return 'other';

    const extension = url.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    }
    return 'other';
  };

  const handleRemoveDocument = () => {
    handleRemove();
    onDocumentChange('');
  };

  const docType = documentUrl ? getDocumentType(documentUrl) : 'other';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {documentUrl ? (
        <div className="relative border rounded-md p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            {docType === 'image' ? (
              <div className="w-full max-w-xs">
                <img 
                  src={documentUrl} 
                  alt={documentType || "Document"}
                  className="max-h-48 object-contain rounded-md mx-auto"
                />
              </div>
            ) : docType === 'pdf' ? (
              <div className="flex items-center gap-2 text-gray-700">
                <FileText className="h-8 w-8 text-red-500" />
                <span className="text-sm font-medium">PDF Document</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-700">
                <File className="h-8 w-8 text-blue-500" />
                <span className="text-sm font-medium">{documentType || "Document"}</span>
              </div>
            )}

            <div className="ml-auto flex gap-2">
              <a 
                href={documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                title="Download document"
              >
                <Download className="h-5 w-5" />
              </a>
              
              <button
                type="button"
                onClick={handleRemoveDocument}
                disabled={isPending}
                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"
                title="Remove document"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => !isPending && fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center ${
            isPending ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'border-gray-300 hover:border-gray-400 cursor-pointer'
          }`}
        >
          {isPending ? (
            <>
              <Loader className="h-8 w-8 text-gray-400 animate-spin mb-2" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload {documentType || "document"}</span>
              <span className="text-xs text-gray-400 mt-1">Supports images, PDFs, and Word documents</span>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        disabled={isPending}
        className="hidden"
      />
    </div>
  );
}
