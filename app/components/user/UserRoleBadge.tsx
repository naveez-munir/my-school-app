import { UserRoleEnum, roleLabels } from '~/types/user';

interface UserRoleBadgeProps {
  role: UserRoleEnum;
}

const roleColors: Record<UserRoleEnum, string> = {
  [UserRoleEnum.SUPER_ADMIN]: 'bg-red-100 text-red-800 border-red-200',
  [UserRoleEnum.TENANT_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-200',
  [UserRoleEnum.PRINCIPAL]: 'bg-blue-100 text-blue-800 border-blue-200',
  [UserRoleEnum.ADMIN]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [UserRoleEnum.TEACHER]: 'bg-green-100 text-green-800 border-green-200',
  [UserRoleEnum.STUDENT]: 'bg-gray-100 text-gray-800 border-gray-200',
  [UserRoleEnum.PARENT]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [UserRoleEnum.ACCOUNTANT]: 'bg-teal-100 text-teal-800 border-teal-200',
  [UserRoleEnum.LIBRARIAN]: 'bg-pink-100 text-pink-800 border-pink-200',
  [UserRoleEnum.DRIVER]: 'bg-orange-100 text-orange-800 border-orange-200',
  [UserRoleEnum.SECURITY]: 'bg-slate-100 text-slate-800 border-slate-200',
  [UserRoleEnum.CLEANER]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  [UserRoleEnum.GUARDIAN]: 'bg-amber-100 text-amber-800 border-amber-200',
};

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const colorClass = roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  const label = roleLabels[role] || role;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {label}
    </span>
  );
};
