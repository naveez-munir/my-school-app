import { useNavigate } from 'react-router';
import { isAdmin } from '~/utils/auth';

interface StudentSectionHeaderProps {
  title: string;
  editPath?: string;
  studentId?: string;
  buttonText?: string;
}

export function StudentSectionHeader({ 
  title, 
  editPath, 
  studentId,
  buttonText = 'Edit'
}: StudentSectionHeaderProps) {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();

  if (!isAdminUser) {
    return null;
  }

  return (
    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      {editPath && studentId && (
        <button 
          onClick={() => navigate(`/dashboard/students/${studentId}${editPath}`)}
          className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
