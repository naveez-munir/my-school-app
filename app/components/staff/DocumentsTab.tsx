import { Plus, Trash2 } from 'lucide-react';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { DocumentUploader } from '~/components/student/form/DocumentUploader';
import { type Document } from '~/types/staff';
import { DocumentTypes } from '~/types/teacher';

interface DocumentsTabProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  isSubmitting: boolean;
  staffId?: string;
}

export function DocumentsTab({
  documents,
  setDocuments,
  isSubmitting,
  staffId = ""
}: DocumentsTabProps) {
  const handleAddDocument = () => {
    setDocuments([...documents, {
      documentType: "",
      documentUrl: "",
      uploadDate: new Date()
    }]);
  };

  const handleChange = (index: number, field: keyof Document, value: any) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    setDocuments(updated);
  };

  const handleRemoveDocument = (index: number) => {
    const updated = [...documents];
    updated.splice(index, 1);
    setDocuments(updated);
  };

  const handleDocumentUrlChange = (index: number, url: string) => {
    handleChange(index, 'documentUrl', url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">Documents</h4>
        <button
          type="button"
          onClick={handleAddDocument}
          className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Document
        </button>
      </div>
      
      {documents.length === 0 ? (
        <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
          No documents added.
        </div>
      ) : (
        documents.map((doc, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium">Document #{index + 1}</h5>
              <button
                type="button"
                onClick={() => handleRemoveDocument(index)}
                className="text-red-600 hover:text-red-800"
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <SelectInput
              label="Document Type"
              value={doc.documentType as DocumentTypes}
              options={DocumentTypes}
              onChange={(value) => handleChange(index, 'documentType', value)}
              placeholder="Select document type"
              required
              disabled={isSubmitting}
            />
            
            <div className="mt-4">
              <DocumentUploader
                currentDocumentUrl={doc.documentUrl}
                documentType={doc.documentType || "Document"}
                onDocumentChange={(url) => handleDocumentUrlChange(index, url)}
                folder={`staff/${staffId}/documents`}
                label="Upload Document"
              />
            </div>
            
            <div className="mt-4">
              <DateInput
                label="Upload Date"
                value={doc.uploadDate ? new Date(doc.uploadDate).toISOString().split('T')[0] : ''}
                onChange={(value) => handleChange(index, 'uploadDate', new Date(value))}
                disabled={isSubmitting || true}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
