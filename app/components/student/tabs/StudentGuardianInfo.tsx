import type { StudentDataProps } from '~/types/student';
import { GuardianInfoOption4 } from './GuardianInfoOptions';

export function StudentGuardianInfo({student} : StudentDataProps) {
  return <GuardianInfoOption4 student={student} />;
}
