import { useNavigate } from 'react-router';
import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { Image, FileText, Calendar, ExternalLink } from 'lucide-react';

export function StudentDocuments({student} : StudentDataProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      <StudentSectionHeader
        title="Student Documents"
        editPath="/edit/documents"
        studentId={student._id}
        buttonText="Manage Documents"
      />

      <div className="p-6 space-y-8">
        {/* Student Photo Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Student Photo</h4>
          {student.photoUrl ? (
            <div className="flex flex-col items-center md:items-start">
              <img
                src={student.photoUrl}
                alt={`${student.firstName} ${student.lastName}`}
                className="h-40 w-40 object-cover rounded-lg border border-gray-300"
              />
              <p className="mt-2 text-sm text-gray-600">
                Student ID Photo
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">No photo uploaded</p>
            </div>
          )}
        </div>

        {/* Uploaded Documents Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Uploaded Documents</h4>

          {student.documents && student.documents.length > 0 ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Document Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {student.documents.map((doc, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.documentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatUserFriendlyDate(doc.uploadDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-4">No documents uploaded</p>
              <button
                onClick={() => navigate(`/dashboard/students/${student._id}/edit/documents`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
