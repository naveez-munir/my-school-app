import { useState, useEffect } from 'react';
import type { CreateStudentDto } from '~/types/student';
import { PhotoUpload } from './PhotoUpload';

interface Document {
  documentType: string;
  documentUrl: string;
  uploadDate?: Date;
}

interface DocumentsStepProps {
  data: Partial<CreateStudentDto>;
  onComplete: (data: Partial<CreateStudentDto>) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export function DocumentsStep({ data, onComplete, onBack, isLastStep }: DocumentsStepProps) {
  const [formData, setFormData] = useState({
    photoUrl: data.photoUrl || '',
    documents: data.documents || []
  });
  
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    documentType: '',
    documentUrl: ''
  });

  useEffect(() => {
    setFormData({
      photoUrl: data.photoUrl || '',
      documents: data.documents || []
    });
  }, [data]);

  const handlePhotoChange = (url: string) => {
    setFormData(prev => ({ ...prev, photoUrl: url }));
  };

  const handleAddDocument = () => {
    if (newDocument.documentType && newDocument.documentUrl) {
      const documentToAdd = {
        ...newDocument,
        uploadDate: new Date()
      };
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, documentToAdd as Document]
      }));
      
      // Reset the form
      setNewDocument({
        documentType: '',
        documentUrl: ''
      });
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  // Predefined document types
  const documentTypes = [
    'Birth Certificate',
    'CNIC',
    'Previous School Records',
    'Medical Records',
    'Vaccination Records',
    'Transfer Certificate',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-8">
        {/* Student Photo Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Student Photo</h3>
          <p className="mt-1 text-sm text-gray-600">
            Upload a clear, recent photo of the student.
          </p>
          <div className="mt-4">
            <PhotoUpload
              currentPhoto={formData.photoUrl}
              onPhotoChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Student Documents</h3>
          <p className="mt-1 text-sm text-gray-600">
            Upload important student documents such as birth certificate, previous school records, etc.
          </p>

          {/* List of added documents */}
          {formData.documents.length > 0 && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.documents.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.documentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add document form */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Document Type</label>
              <select
                id="documentType"
                value={newDocument.documentType}
                onChange={(e) => setNewDocument(prev => ({ ...prev, documentType: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select document type</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700">Document URL/Path</label>
              <input
                type="text"
                id="documentUrl"
                value={newDocument.documentUrl}
                onChange={(e) => setNewDocument(prev => ({ ...prev, documentUrl: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="URL or path to document"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddDocument}
                disabled={!newDocument.documentType || !newDocument.documentUrl}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          {isLastStep ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  );
}
