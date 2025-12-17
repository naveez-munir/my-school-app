import type { StudentDataProps } from '~/types/student';
import { PersonalInfoOption4 } from './PersonalInfo';

export function StudentPersonalInfo({student} : StudentDataProps) {
  return <PersonalInfoOption4 student={student} />;
}
