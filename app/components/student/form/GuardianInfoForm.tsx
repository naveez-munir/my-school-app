import { useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { FormField } from "~/components/common/form/FormField";
import {
  GuardianRelationship,
  type Guardian,
  type UpdateGuardianInfoDto,
} from "~/types/student";
import { useUpdateGuardianInfo } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";
import { updateGuardianInfoSchema, type UpdateGuardianInfoFormData } from "~/utils/validation/studentValidation";

export function GuardianInfoForm() {
  const { id } = useParams<{ id: string }>();
  const {
    student,
    formData,
    setFormData,
    isLoadingStudent,
    isPending,
    handleSubmit: submitToApi,
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateGuardianInfoFormData>({
    resolver: zodResolver(updateGuardianInfoSchema),
    defaultValues: formData as UpdateGuardianInfoFormData,
  });

  useEffect(() => {
    if (formData) {
      reset(formData as UpdateGuardianInfoFormData);
    }
  }, [formData, reset]);

  const onSubmit = async (validatedData: UpdateGuardianInfoFormData) => {
    setFormData(validatedData as Guardian);
    await submitToApi(validatedData);
  };

  return (
    <StudentFormLayout
      student={student}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPending}
      title="Edit Guardian Information"
      description={`Update guardian details for {studentName}.`}
      onSubmit={handleSubmit(onSubmit)}
      studentId={id}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="name"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Guardian Name"
              value={field.value}
              onChange={field.onChange}
              required
            />
          )}
        />

        <FormField
          name="cniNumber"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="CNI Number"
              value={field.value}
              onChange={field.onChange}
              required
            />
          )}
        />

        <FormField
          name="relationship"
          control={control}
          errors={errors}
          render={(field) => (
            <SelectInput<typeof GuardianRelationship>
              label="Relationship"
              value={field.value}
              onChange={field.onChange}
              options={GuardianRelationship}
              placeholder="Select Relationship"
              required
            />
          )}
        />

        <FormField
          name="phone"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Phone"
              value={field.value || ""}
              onChange={field.onChange}
              type="tel"
              required
            />
          )}
        />

        <FormField
          name="email"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Email"
              value={field.value || ""}
              onChange={field.onChange}
              type="email"
            />
          )}
        />
      </div>
    </StudentFormLayout>
  );
}
