import type { StudentDataProps } from '~/types/student';
import { GuardianInfoOption4 } from './GuardianInfo';

export function StudentGuardianInfo({student} : StudentDataProps) {
  return <GuardianInfoOption4 student={student} />;
}
