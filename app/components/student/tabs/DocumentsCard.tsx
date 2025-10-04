import { useNavigate } from 'react-router';
import { isAdmin } from '~/utils/auth';
import { FileText, Edit2 } from 'lucide-react';

interface DocumentsCardProps {
  documents?: Array<any>;
  editPath?: string;
  studentId?: string;
  showEditButton?: boolean;
}

export function DocumentsCard({
  documents = [],
  editPath,
  studentId,
  showEditButton = true
}: DocumentsCardProps) {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();
  const documentCount = documents?.length || 0;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        {showEditButton && editPath && isAdminUser && studentId && (
          <button
            onClick={() => navigate(`/dashboard/students/${studentId}${editPath}`)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <FileText className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 text-center font-medium">
          {documentCount > 0
            ? `${documentCount} document${documentCount !== 1 ? 's' : ''} uploaded`
            : 'No documents'}
        </p>
      </div>
    </div>
  );
}

