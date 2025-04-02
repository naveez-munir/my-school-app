import { Plus, Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { type Document } from '~/types/staff';

interface DocumentsTabProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  isSubmitting: boolean;
}

export function DocumentsTab({
  documents,
  setDocuments,
  isSubmitting
}: DocumentsTabProps) {
  const handleAddDocument = () => {
    setDocuments([...documents, {
      title: '',
      type: '',
      url: '',
      uploadDate: new Date(),
      expiryDate: undefined,
      description: ''
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <TextInput
                label="Title"
                value={doc.title}
                onChange={(value) => handleChange(index, 'title', value)}
                required
                disabled={isSubmitting}
              />
              
              <TextInput
                label="Type"
                value={doc.type}
                onChange={(value) => handleChange(index, 'type', value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-2">
              <TextInput
                label="Document URL"
                value={doc.url}
                onChange={(value) => handleChange(index, 'url', value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <DateInput
                label="Upload Date"
                value={doc.uploadDate ? new Date(doc.uploadDate).toISOString().split('T')[0] : ''}
                onChange={(value) => handleChange(index, 'uploadDate', new Date(value))}
                disabled={isSubmitting}
              />
              
              <DateInput
                label="Expiry Date"
                value={doc.expiryDate ? new Date(doc.expiryDate).toISOString().split('T')[0] : ''}
                onChange={(value) => handleChange(index, 'expiryDate', new Date(value))}
                disabled={isSubmitting}
              />
            </div>
            
            <TextArea
              label="Description"
              value={doc.description || ''}
              onChange={(value) => handleChange(index, 'description', value)}
              rows={2}
              disabled={isSubmitting}
            />
          </div>
        ))
      )}
    </div>
  );
}
