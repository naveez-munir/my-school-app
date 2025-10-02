import type { StudentDataProps } from '~/types/student';
import { PersonalInfoOption4 } from './PersonalInfoOptions';

export function StudentPersonalInfo({student} : StudentDataProps) {
  return <PersonalInfoOption4 student={student} />;
}
