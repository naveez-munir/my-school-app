import { useState, useEffect } from 'react';
import { UserRoleEnum } from '~/types/user';
import { TeacherSelector } from '../common/TeacherSelector';
import { StaffSelector } from '../common/StaffSelector';
import { ClassSelector } from '../common/ClassSelector';
import { StudentSelector } from '../common/StudentSelector';

interface EntitySelectorProps {
  role: UserRoleEnum | '';
  value: string;
  onChange: (entityId: string) => void;
  required?: boolean;
  className?: string;
}

export function EntitySelector({
  role,
  value,
  onChange,
  required = false,
  className = ''
}: EntitySelectorProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  useEffect(() => {
    setSelectedClassId('');
  }, [role]);

  if (!role) {
    return null;
  }

  const isStaffRole = [
    UserRoleEnum.ADMIN,
    UserRoleEnum.PRINCIPAL,
    UserRoleEnum.ACCOUNTANT,
    UserRoleEnum.LIBRARIAN,
    UserRoleEnum.DRIVER,
    UserRoleEnum.SECURITY,
    UserRoleEnum.CLEANER,
    UserRoleEnum.TENANT_ADMIN,
  ].includes(role);

  if (role === UserRoleEnum.TEACHER) {
    return (
      <TeacherSelector
        value={value}
        onChange={onChange}
        label="Select Teacher"
        required={required}
        placeholder="Search for teacher..."
        className={className}
      />
    );
  }

  if (
    role === UserRoleEnum.STUDENT ||
    role === UserRoleEnum.GUARDIAN ||
    role === UserRoleEnum.PARENT
  ) {
    const studentLabel = role === UserRoleEnum.STUDENT
      ? "Select Student from Class"
      : "Select Student (to link guardian/parent)";

    return (
      <div className={className}>
        <ClassSelector
          value={selectedClassId}
          onChange={(classId) => {
            setSelectedClassId(classId);
            onChange('');
          }}
          label="Select Class First"
          required={required}
          placeholder="Choose a class..."
        />

        {selectedClassId && (
          <div className="mt-4">
            <StudentSelector
              key={selectedClassId}
              value={value}
              onChange={onChange}
              classId={selectedClassId}
              label={studentLabel}
              required={required}
              placeholder="Search student by name..."
            />
          </div>
        )}
      </div>
    );
  }

  if (isStaffRole) {
    return (
      <StaffSelector
        value={value}
        onChange={onChange}
        label="Select Staff Member"
        required={required}
        placeholder="Search for staff..."
        className={className}
      />
    );
  }

  return null;
}
