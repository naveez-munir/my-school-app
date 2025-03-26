import { useParams } from "react-router";
import { GuardianFormFields } from "./GuardianFormFields";
import {
  GuardianRelationship,
  type Guardian,
  type UpdateGuardianInfoDto,
} from "~/types/student";
import { useUpdateGuardianInfo } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";

export function GuardianInfoForm() {
  const { id } = useParams<{ id: string }>();
  const {
    student,
    formData,
    handleChange,
    handleSubmit,
    isLoadingStudent,
    isPending,
  } = useStudentForm<Guardian, UpdateGuardianInfoDto>({
    initialDataMapper: (student) => ({
      name: student.guardian?.name || "",
      cniNumber: student.guardian?.cniNumber || "",
      relationship:
        student.guardian?.relationship || GuardianRelationship.Father,
      phone: student.guardian?.phone || "",
      email: student.guardian?.email || null,
    }),
    defaultData: {
      name: "",
      cniNumber: "",
      relationship: GuardianRelationship.Father,
      phone: "",
      email: null,
    },
    mutationHook: useUpdateGuardianInfo,
    transformOnSubmit: (guardianData) => ({
      guardian: guardianData,
    }),
  });

  return (
    <StudentFormLayout
      student={student}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPending}
      title="Edit Guardian Information"
      description={`Update guardian details for {studentName}.`}
      onSubmit={handleSubmit}
      studentId={id}
    >
      <GuardianFormFields data={formData} onChange={handleChange} />
    </StudentFormLayout>
  );
}
