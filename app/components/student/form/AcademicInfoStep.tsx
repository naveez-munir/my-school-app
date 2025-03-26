import { useParams } from "react-router";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { ClassSelector } from "~/components/common/ClassSelector";
import { GradeLevel, type UpdateAcademicInfoDto } from "~/types/student";
import { useUpdateAcademicInfo } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";

export function AcademicInfoForm() {
  const { id } = useParams<{ id: string }>();
  const {
    student,
    formData,
    handleChange,
    handleSubmit,
    isLoadingStudent,
    isPending,
  } = useStudentForm<UpdateAcademicInfoDto>({
    initialDataMapper: (student) => ({
      class: student.class,
      rollNumber: student.rollNumber,
      gradeLevel: student.gradeLevel || "",
      enrollmentDate: student.enrollmentDate || null,
    }),
    defaultData: {
      class: null,
      rollNumber: null,
      gradeLevel: "",
      enrollmentDate: null,
    },
    mutationHook: useUpdateAcademicInfo,
  });

  return (
    <StudentFormLayout
      student={student}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPending}
      title="Edit Academic Information"
      description={`Update academic details for {studentName}.`}
      onSubmit={handleSubmit}
      studentId={id}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput<typeof GradeLevel>
          label="Grade Level"
          value={formData.gradeLevel as GradeLevel}
          onChange={(value) => handleChange("gradeLevel", value)}
          options={GradeLevel}
          placeholder="Select Grade Level"
          required
        />

        <ClassSelector
          value={formData.class || ""}
          onChange={(classId) => handleChange("class", classId)}
          label="Class"
        />

        <TextInput
          label="Roll Number"
          value={formData.rollNumber || ""}
          onChange={(value) => handleChange("rollNumber", value)}
        />

        <DateInput
          label="Enrollment Date"
          value={formData.enrollmentDate || ""}
          onChange={(value) => handleChange("enrollmentDate", value)}
        />
      </div>
    </StudentFormLayout>
  );
}
