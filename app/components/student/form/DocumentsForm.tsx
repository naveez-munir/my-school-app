import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useStudent, useAddStudentDocument } from '~/hooks/useStudentQueries';
import { DocumentType, type AddDocumentDto, type Student } from '~/types/student';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { PhotoUpload } from './PhotoUpload';

export function DocumentsForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading: isLoadingStudent } = useStudent(id || '');
  const addDocumentMutation = useAddStudentDocument();

  const [documents, setDocuments] = useState<Student['documents']>([]);
  const [newDocument, setNewDocument] = useState<Partial<AddDocumentDto>>({
    documentType: '',
    documentUrl: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (student && student.documents) {
      setDocuments(student.documents);
    }
  }, [student]);

  const handleAddDocument = async () => {
    if (!id || !newDocument.documentType || !newDocument.documentUrl) return;

    try {
      setIsSubmitting(true);
      await addDocumentMutation.mutateAsync({
        id,
        data: newDocument as AddDocumentDto
      });
      
      // Reset the form
      setNewDocument({
        documentType: '',
        documentUrl: ''
      });
    } catch (error) {
      console.error('Failed to add document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDocument = (index: number) => {
    // Implement document removal logic if API supports it
    console.log('Remove document at index:', index);
    // This would typically call an API to remove the document
  };

  if (isLoadingStudent) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Student not found</h3>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/dashboard/students')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to students list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Student Documents</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update documents and photo for {student.firstName} {student.lastName}.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-8">
        // DocumentsForm.tsx (continued)
          {/* Student Photo Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Student Photo</h3>
            <p className="mt-1 text-sm text-gray-600">
              Upload a clear, recent photo of the student.
            </p>
            <div className="mt-4">
              <PhotoUpload
                currentPhoto={student.photoUrl || ''}
                onPhotoChange={(url) => {
                  // Implement photo update logic
                  console.log('Update photo:', url);
                }}
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
            {documents && documents.length > 0 && (
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
                    {documents.map((doc, index) => (
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
              <SelectInput<typeof DocumentType>
                label="Document Type"
                value={newDocument.documentType as DocumentType || null}
                options={DocumentType}
                onChange={(value) => setNewDocument(prev => ({ ...prev, documentType: value }))}
                placeholder="Select document type"
              />
              {/* TODO: Replace with actual file picker component */}
              <div>
                <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700">Document URL/Path</label>
                <input
                  type="text"
                  id="documentUrl"
                  value={newDocument.documentUrl || ''}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, documentUrl: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="URL or path to document"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddDocument}
                  disabled={!newDocument.documentType || !newDocument.documentUrl || isSubmitting || addDocumentMutation.isPending}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting || addDocumentMutation.isPending ? 'Adding...' : 'Add Document'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/students/${id}`)}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
