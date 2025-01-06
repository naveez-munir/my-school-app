import { getUserRole } from '~/utils/auth';
import { UserRoleEnum } from '~/types/user';
import { TeacherSalarySection } from '~/components/salary/TeacherSalarySection';

export default function Salary() {
  const userRole = getUserRole();
  const role = userRole?.role;

  if (role === UserRoleEnum.TEACHER) {
    return <TeacherSalarySection />;
  }

  if (role === UserRoleEnum.STAFF) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Salary Details</h1>
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800">
            Staff salary feature is coming soon. Please contact administration for salary details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Access denied. This section is only available for teachers and staff.
      </div>
    </div>
  );
}

