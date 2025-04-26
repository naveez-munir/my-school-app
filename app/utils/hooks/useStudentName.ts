import { useMemo } from 'react';
import { useStudents } from '~/hooks/useStudentQueries';

export function useStudentName(studentId: string | undefined): string {
  const { data: students = [] } = useStudents();
  
  const studentName = useMemo(() => {
    if (!studentId) return '';
    
    const student = students.find(s => s.id === studentId);
    return student ? student.name : '';
  }, [studentId, students]);
  
  return studentName;
}
