import { useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { ClassSelector } from "~/components/common/ClassSelector";
import { GradeSelector } from "~/components/common/GradeSelector";
import { FormField } from "~/components/common/form/FormField";
import type { UpdateAcademicInfoDto } from "~/types/student";
import { useUpdateAcademicInfo } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";
import { updateAcademicInfoSchema, type UpdateAcademicInfoFormData } from "~/utils/validation/studentValidation";

export function AcademicInfoForm() {
  const { id } = useParams<{ id: string }>();
  const {
    student,
    formData,
    setFormData,
    isLoadingStudent,
    isPending,
    handleSubmit: submitToApi,
  } = useStudentForm<UpdateAcademicInfoDto>({
    initialDataMapper: (student) => ({
      class: student.class?._id || null,
      rollNumber: student.rollNumber,
      gradeLevel: student.gradeLevel?.toUpperCase() || "",
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateAcademicInfoFormData>({
    resolver: zodResolver(updateAcademicInfoSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  const onSubmit = async (validatedData: UpdateAcademicInfoFormData) => {
    setFormData(validatedData as UpdateAcademicInfoDto);
    await submitToApi(validatedData);
  };

  return (
    <StudentFormLayout
      student={student || null}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPending}
      title="Edit Academic Information"
      description={`Update academic details for {studentName}.`}
      onSubmit={handleSubmit(onSubmit)}
      studentId={id}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="gradeLevel"
          control={control}
          errors={errors}
          render={(field) => (
            <GradeSelector
              value={field.value || ""}
              onChange={field.onChange}
              label="Grade Level"
              required
            />
          )}
        />

        <FormField
          name="class"
          control={control}
          errors={errors}
          render={(field) => (
            <ClassSelector
              value={field.value || ""}
              onChange={field.onChange}
              label="Class"
            />
          )}
        />

        <FormField
          name="rollNumber"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Roll Number"
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />

        <FormField
          name="enrollmentDate"
          control={control}
          errors={errors}
          render={(field) => (
            <DateInput
              label="Enrollment Date"
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </StudentFormLayout>
  );
}
