import { useNavigate } from 'react-router';
import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatDate } from '~/utils/dateUtils';


export function StudentDocuments({student} : StudentDataProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow rounded-lg">
      <StudentSectionHeader
        title="Student Documents" 
        editPath="/edit/documents" 
        studentId={student._id} 
        buttonText="Manage Documents"
      />
      
      <div className="p-6">
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Student Photo</h4>
          {student.photoUrl ? (
            <div className="flex flex-col items-center md:items-start">
              <img 
                src={student.photoUrl} 
                alt={`${student.firstName} ${student.lastName}`}
                className="h-40 w-40 object-cover rounded-lg border border-gray-200"
              />
              <p className="mt-2 text-sm text-gray-500">
                Student ID Photo
              </p>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-gray-500">No photo uploaded</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-4">Uploaded Documents</h4>
          
          {student.documents && student.documents.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {student.documents.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.documentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(doc.uploadDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <a 
                          href={doc.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-500">No documents uploaded</p>
              <button 
                onClick={() => navigate(`/dashboard/students/${student._id}/edit/documents`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Upload Documents
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
