import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { StudentResponse } from '~/types/student';
import type { TeacherResponse } from '~/types/teacher';
import type { StaffListResponse } from '~/types/staff';

type EntityType = 'student' | 'teacher' | 'staff' | 'guardian';

interface UniquenessResult {
  isUnique: boolean;
  message: string;
}

const UNIQUE: UniquenessResult = { isUnique: true, message: '' };

interface UseUniquenessValidatorOptions {
  excludeId?: string;
  excludeType?: EntityType;
}

export const useUniquenessValidator = (options?: UseUniquenessValidatorOptions) => {
  const queryClient = useQueryClient();
  const { excludeId, excludeType } = options || {};

  const getCachedData = useCallback(() => {
    const students = queryClient.getQueryData<StudentResponse[]>(['students', 'list', {}]) || [];
    const teachers = queryClient.getQueryData<TeacherResponse[]>(['teachers', 'list', {}]) || [];
    const staff = queryClient.getQueryData<StaffListResponse[]>(['staff', 'list', {}]) || [];
    return { students, teachers, staff };
  }, [queryClient]);

  const checkCnic = useCallback((value: string, entityType: EntityType): UniquenessResult => {
    if (!value?.trim()) return UNIQUE;
    const { students, teachers, staff } = getCachedData();
    const trimmed = value.trim();

    if (entityType === 'guardian') {
      for (const s of students) {
        if (excludeType === 'student' && s.id === excludeId) continue;
        if (s.cnic === trimmed) return { isUnique: false, message: `This CNIC is already used by Student: ${s.name}` };
      }
      for (const s of students) {
        if (excludeType === 'student' && s.id === excludeId) continue;
        if (s.guardianCnic === trimmed) return { isUnique: false, message: `This CNIC is already used by another Guardian (of ${s.name})` };
      }
      return UNIQUE;
    }

    for (const s of students) {
      if (excludeType === 'student' && s.id === excludeId) continue;
      if (s.cnic === trimmed) return { isUnique: false, message: `This CNIC is already used by Student: ${s.name}` };
    }
    for (const t of teachers) {
      if (excludeType === 'teacher' && t.id === excludeId) continue;
      if (t.cniNumber === trimmed) return { isUnique: false, message: `This CNIC is already used by Teacher: ${t.name}` };
    }
    for (const s of staff) {
      if (excludeType === 'staff' && s.id === excludeId) continue;
      if (s.cniNumber === trimmed) return { isUnique: false, message: `This CNIC is already used by Staff: ${s.name}` };
    }

    return UNIQUE;
  }, [getCachedData, excludeId, excludeType]);

  const checkEmail = useCallback((value: string, entityType: EntityType): UniquenessResult => {
    if (!value?.trim()) return UNIQUE;
    const { students, teachers, staff } = getCachedData();
    const trimmed = value.trim().toLowerCase();

    if (entityType === 'student') {
      for (const s of students) {
        if (excludeType === 'student' && s.id === excludeId) continue;
        if (s.email?.toLowerCase() === trimmed) return { isUnique: false, message: `This email is already used by Student: ${s.name}` };
      }
    } else if (entityType === 'teacher') {
      for (const t of teachers) {
        if (excludeType === 'teacher' && t.id === excludeId) continue;
        if (t.email?.toLowerCase() === trimmed) return { isUnique: false, message: `This email is already used by Teacher: ${t.name}` };
      }
    } else if (entityType === 'staff') {
      for (const s of staff) {
        if (excludeType === 'staff' && s.id === excludeId) continue;
        if (s.email?.toLowerCase() === trimmed) return { isUnique: false, message: `This email is already used by Staff: ${s.name}` };
      }
    } else if (entityType === 'guardian') {
      for (const s of students) {
        if (excludeType === 'student' && s.id === excludeId) continue;
        if (s.guardianEmail?.toLowerCase() === trimmed) return { isUnique: false, message: `This email is already used by another Guardian (of ${s.name})` };
      }
    }

    return UNIQUE;
  }, [getCachedData, excludeId, excludeType]);

  const checkPhone = useCallback((value: string, entityType: EntityType): UniquenessResult => {
    if (!value?.trim()) return UNIQUE;
    const { students, teachers, staff } = getCachedData();
    const trimmed = value.trim();

    if (entityType === 'student') {
      for (const s of students) {
        if (excludeType === 'student' && s.id === excludeId) continue;
        if (s.phone === trimmed) return { isUnique: false, message: `This phone is already used by Student: ${s.name}` };
      }
    } else if (entityType === 'teacher') {
      for (const t of teachers) {
        if (excludeType === 'teacher' && t.id === excludeId) continue;
        if (t.phone === trimmed) return { isUnique: false, message: `This phone is already used by Teacher: ${t.name}` };
      }
    } else if (entityType === 'staff') {
      for (const s of staff) {
        if (excludeType === 'staff' && s.id === excludeId) continue;
        if (s.phone === trimmed) return { isUnique: false, message: `This phone is already used by Staff: ${s.name}` };
      }
    } else if (entityType === 'guardian') {
      for (const s of students) {
        if (excludeType === 'student' && s.id === excludeId) continue;
        if (s.guardianPhone === trimmed) return { isUnique: false, message: `This phone is already used by another Guardian (of ${s.name})` };
      }
    }

    return UNIQUE;
  }, [getCachedData, excludeId, excludeType]);

  return { checkCnic, checkEmail, checkPhone };
};
