import { useState } from "react";
import { Plus, Trash2, PaperclipIcon, Upload } from "lucide-react";
import type { AttachmentRequest } from "~/types/dailyDiary";

interface AttachmentsFormProps {
  attachments: AttachmentRequest[];
  onChange: (attachments: AttachmentRequest[]) => void;
}

export function AttachmentsForm({ attachments, onChange }: AttachmentsFormProps) {
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // In a real application, you would implement actual file upload functionality
  // For now, we'll simulate it with a placeholder function
  const simulateFileUpload = (file: File) => {
    setUploadingFile(true);
    
    // Simulate a delay to mimic file upload
    setTimeout(() => {
      const newAttachment: AttachmentRequest = {
        title: file.name,
        fileUrl: `https://example.com/files/${file.name}`, // This would be the actual URL from your server
        fileType: file.type
      };
      
      onChange([...attachments, newAttachment]);
      setUploadingFile(false);
    }, 1000);
  };

  const addAttachment = () => {
    // In a real implementation, this would typically trigger a file input click
    // For now, we'll just add a placeholder attachment
    const newAttachment: AttachmentRequest = {
      title: `Attachment ${attachments.length + 1}`,
      fileUrl: `https://example.com/files/attachment${attachments.length + 1}`,
      fileType: 'application/pdf'
    };
    
    onChange([...attachments, newAttachment]);
  };

  const updateAttachment = (index: number, field: keyof AttachmentRequest, value: string) => {
    const updatedAttachments = [...attachments];
    updatedAttachments[index] = { 
      ...updatedAttachments[index], 
      [field]: value 
    };
    
    onChange(updatedAttachments);
  };

  const removeAttachment = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  // This is the file input ref and handler for actual file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      simulateFileUpload(file);
      e.target.value = ''; // Reset the input
    }
  };

  return (
    <div className="p-6 space-y-4 border-t">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Attachments</h2>
        <div className="flex space-x-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadingFile}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 cursor-pointer ${
              uploadingFile ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload File
          </label>
          <button
            type="button"
            onClick={addAttachment}
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 text-sm hover:bg-blue-100"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Manually
          </button>
        </div>
      </div>
      
      {uploadingFile && (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
          <span>Uploading file...</span>
        </div>
      )}
      
      {attachments.length === 0 && !uploadingFile && (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
          No attachments added yet.
        </div>
      )}
      
      {attachments.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {attachments.map((attachment, index) => (
            <AttachmentItem
              key={index}
              attachment={attachment}
              index={index}
              onUpdate={updateAttachment}
              onRemove={removeAttachment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AttachmentItemProps {
  attachment: AttachmentRequest;
  index: number;
  onUpdate: (index: number, field: keyof AttachmentRequest, value: string) => void;
  onRemove: (index: number) => void;
}

function AttachmentItem({ attachment, index, onUpdate, onRemove }: AttachmentItemProps) {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <PaperclipIcon className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-sm font-medium">Attachment #{index + 1}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={attachment.title}
            onChange={(e) => onUpdate(index, 'title', e.target.value)}
            required
            placeholder="e.g., Worksheet, Assignment Sheet"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            File URL<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={attachment.fileUrl}
            onChange={(e) => onUpdate(index, 'fileUrl', e.target.value)}
            required
            placeholder="e.g., https://example.com/files/worksheet.pdf"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            File Type<span className="text-red-500">*</span>
          </label>
          <select
            value={attachment.fileType}
            onChange={(e) => onUpdate(index, 'fileType', e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select file type</option>
            <option value="application/pdf">PDF Document</option>
            <option value="image/jpeg">Image (JPEG)</option>
            <option value="image/png">Image (PNG)</option>
            <option value="application/msword">Word Document</option>
            <option value="application/vnd.ms-excel">Excel Spreadsheet</option>
            <option value="application/vnd.ms-powerpoint">PowerPoint Presentation</option>
            <option value="text/plain">Text File</option>
            <option value="application/zip">ZIP Archive</option>
            <option value="video/mp4">Video (MP4)</option>
            <option value="audio/mpeg">Audio (MP3)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
