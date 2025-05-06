import { useMemo } from 'react';
import { useStudents } from '~/hooks/useStudentQueries';
import { useTeachers } from '~/hooks/useTeacherQueries';
import { useStaffList } from '~/hooks/useStaffQueries';

export function useEntityName<T extends { id: string; name: string }>(
  entityId: string | undefined,
  entities: T[] = [],
  idField: keyof T = 'id' as keyof T,
  nameField: keyof T = 'name' as keyof T
): string {
  const entityName = useMemo(() => {
    if (!entityId) return '';
    
    const entity = entities.find(e => e[idField] === entityId);
    return entity ? String(entity[nameField]) : '';
  }, [entityId, entities, idField, nameField]);
  
  return entityName;
}


export function useStudentName(studentId: string | undefined): string {
  const { data: students = [] } = useStudents();
  return useEntityName(studentId, students);
}

export function useTeacherName(teacherId: string | undefined): string {
  const { data: teachers = [] } = useTeachers();
  return useEntityName(teacherId, teachers);
}

export function useStaffName(staffId: string | undefined): string {
  const { data: staffMembers = [] } = useStaffList();
  return useEntityName(staffId, staffMembers);
}
