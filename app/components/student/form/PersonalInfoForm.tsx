import { useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { TextArea } from "~/components/common/form/inputs/TextArea";
import { FormField } from "~/components/common/form/FormField";
import {
  Gender,
  BloodGroup,
  type UpdatePersonalInfoDto,
} from "~/types/student";
import { useUpdatePersonalInfo } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";
import { updatePersonalInfoSchema, type UpdatePersonalInfoFormData } from "~/utils/validation/studentValidation";

export function PersonalInfoForm() {
  const { id } = useParams<{ id: string }>();

  const {
    student,
    formData,
    setFormData,
    isLoadingStudent,
    isPending,
    handleSubmit: submitToApi,
  } = useStudentForm<UpdatePersonalInfoDto>({
    initialDataMapper: (student) => ({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      dateOfBirth: student.dateOfBirth || "",
      gender: student.gender || Gender.Male,
      bloodGroup: student.bloodGroup,
      photoUrl: student.photoUrl,
      phone: student.phone,
      email: student.email,
      address: student.address || "",
    }),
    defaultData: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: Gender.Male,
      bloodGroup: undefined,
      photoUrl: null,
      phone: null,
      email: null,
      address: "",
    },
    mutationHook: useUpdatePersonalInfo,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePersonalInfoFormData>({
    resolver: zodResolver(updatePersonalInfoSchema),
    defaultValues: formData,
  });

  // Update form when student data loads
  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  const onSubmit = async (validatedData: UpdatePersonalInfoFormData) => {
    setFormData(validatedData as UpdatePersonalInfoDto);
    await submitToApi(validatedData);
  };

  return (
    <StudentFormLayout
      student={student}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPending}
      title="Edit Personal Information"
      description={`Update personal details for {studentName}.`}
      onSubmit={handleSubmit(onSubmit)}
      studentId={id}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="firstName"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="First Name"
              value={field.value || ""}
              onChange={field.onChange}
              required
            />
          )}
        />

        <FormField
          name="lastName"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="Last Name"
              value={field.value || ""}
              onChange={field.onChange}
              required
            />
          )}
        />

        <FormField
          name="dateOfBirth"
          control={control}
          errors={errors}
          render={(field) => (
            <DateInput
              label="Date of Birth"
              value={field.value || ""}
              onChange={field.onChange}
              required
            />
          )}
        />

        <FormField
          name="gender"
          control={control}
          errors={errors}
          render={(field) => (
            <SelectInput<typeof Gender>
              label="Gender"
              value={field.value || Gender.Male}
              onChange={field.onChange}
              options={Gender}
              placeholder="Select Gender"
              required
            />
          )}
        />

        <FormField
          name="bloodGroup"
          control={control}
          errors={errors}
          render={(field) => (
            <SelectInput<typeof BloodGroup>
              label="Blood Group"
              value={field.value}
              onChange={field.onChange}
              options={BloodGroup}
              placeholder="Select Blood Group"
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

        <div className="md:col-span-2">
          <FormField
            name="address"
            control={control}
            errors={errors}
            render={(field) => (
              <TextArea
                label="Address"
                value={field.value || ""}
                onChange={field.onChange}
                rows={3}
              />
            )}
          />
        </div>
      </div>
    </StudentFormLayout>
  );
}
