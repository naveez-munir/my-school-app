import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { SelectInput } from '../common/form/inputs/SelectInput';
import { DocumentTypes, type Document } from '~/types/teacher';
import { PhotoUpload } from '../student/form/PhotoUpload';
import { DocumentUploader } from '../student/form/DocumentUploader';

interface DocumentsFormProps {
  data: Document[];
  photoUrl?: string;
  teacherId?: string;
  onUpdate: (documents: Document[]) => void;
  onPhotoChange?: (url: string) => void;
}

export function DocumentsForm({ 
  data = [], 
  photoUrl = "",
  teacherId = "",
  onUpdate,
  onPhotoChange
}: DocumentsFormProps) {
  const [newDocument, setNewDocument] = useState<Document>({
    documentType: "",
    documentUrl: ""
  });

  const handleAddDocument = () => {
    if (!newDocument.documentType || !newDocument.documentUrl) return;
    
    const newDoc = {
      ...newDocument,
      uploadDate: new Date()
    };

    onUpdate([...data, newDoc]);

    setNewDocument({
      documentType: "",
      documentUrl: ""
    });
  };

  const handleRemoveDocument = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleDocumentTypeChange = (value: string) => {
    setNewDocument(prev => ({ ...prev, documentType: value }));
  };

  const handleDocumentUrlChange = (url: string) => {
    setNewDocument(prev => ({ ...prev, documentUrl: url }));
  };

  const handlePhotoUpdate = (url: string) => {
    if (onPhotoChange) {
      onPhotoChange(url);
    }
  };

  return (
    <div className="space-y-8">
      {onPhotoChange && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900">Teacher Photo</h3>
          <p className="mt-1 text-sm text-gray-600">
            Upload a clear, professional photo of the teacher.
          </p>
          <div className="mt-4">
            <PhotoUpload
              currentPhoto={photoUrl}
              onPhotoChange={handlePhotoUpdate}
              folder={`teachers/${teacherId}/profile`}
            />
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900">Teacher Documents</h3>
        <p className="mt-1 text-sm text-gray-600">
          Upload important documents such as CNIC, degree certificates, experience letters, etc.
        </p>

        {data.length > 0 && (
          <div className="mt-4 space-y-4">
            {data.map((doc, index) => (
              <div key={index} className="relative bg-gray-50 p-4 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mb-2">
                  <span className="font-medium text-gray-800">{doc.documentType}</span>
                  {doc.uploadDate && (
                    <span className="text-sm text-gray-500 ml-2">
                      Uploaded: {typeof doc.uploadDate === 'string' 
                        ? new Date(doc.uploadDate).toLocaleDateString() 
                        : doc.uploadDate.toLocaleDateString()}
                    </span>
                  )}
                </div>

                <DocumentUploader
                  currentDocumentUrl={doc.documentUrl}
                  documentType={doc.documentType}
                  onDocumentChange={(url) => {
                    const updatedDocs = [...data];
                    updatedDocs[index] = { ...updatedDocs[index], documentUrl: url };
                    onUpdate(updatedDocs);
                  }}
                  folder={`teachers/${teacherId}/documents`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border rounded-md p-4 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-4">Add New Document</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <SelectInput
              label="Document Type"
              value={newDocument.documentType as DocumentTypes}
              options={DocumentTypes}
              onChange={handleDocumentTypeChange}
              placeholder="Select document type"
            />
          </div>
          
          <DocumentUploader
            currentDocumentUrl={newDocument.documentUrl}
            documentType={newDocument.documentType || "Document"}
            onDocumentChange={handleDocumentUrlChange}
            folder={`teachers/${teacherId}/documents`}
            label="Upload Document"
          />

          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddDocument}
              disabled={!newDocument.documentType || !newDocument.documentUrl}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
