import type { TeacherResponse } from '~/types/teacher'
import GenericCombobox from '../common/form/inputs/Select'

interface TeacherSelectProps {
  value: string
  onChange: (value: string) => void
  teachers: TeacherResponse[]
  placeholder?: string
}

export function TeacherSelect({
  value,
  onChange,
  teachers,
  placeholder = 'Select a teacher',
}: TeacherSelectProps) {
  // Convert the string value to the actual teacher object for the Combobox
  const selectedTeacher = teachers.find(teacher => teacher.id === value) || null;
  
  // Handle the teacher object selection and extract the ID
  const handleTeacherChange = (teacher: TeacherResponse | null) => {
    onChange(teacher ? teacher.id : '');
  };

  return (
    <GenericCombobox<TeacherResponse>
      items={teachers}
      value={selectedTeacher}
      onChange={handleTeacherChange}
      displayKey="name"
      valueKey="id"
      placeholder={placeholder}
    />
  )
}
