import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { TextArea } from "~/components/common/form/inputs/TextArea";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { GradeSelector } from "~/components/common/GradeSelector";
import { FormField } from "~/components/common/form/FormField";
import { Gender, BloodGroup } from "~/types/student";
import type { BasicInfoStepProps, CreateStudentDto } from "~/types/student";
import { basicInfoSchema, type BasicInfoFormData } from "~/utils/validation/studentValidation";

export function BasicInfoStep({
  data,
  onComplete,
  onBack,
}: BasicInfoStepProps) {
  const getInitialFormData = (data: Partial<CreateStudentDto>): BasicInfoFormData => {
    return {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      cniNumber: data.cniNumber || "",
      dateOfBirth: data.dateOfBirth || "",
      admissionDate: data.admissionDate || "",
      gender: data.gender || Gender.Male,
      bloodGroup: data.bloodGroup || null,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || "",
      gradeLevel: data.gradeLevel || "",
    };
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: getInitialFormData(data),
  });

  useEffect(() => {
    reset(getInitialFormData(data));
  }, [data, reset]);

  const onSubmit = (validatedData: BasicInfoFormData) => {
    onComplete(validatedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <FormField
          name="firstName"
          control={control}
          errors={errors}
          render={(field) => (
            <TextInput
              label="First Name"
              value={field.value}
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
              placeholder="12345-1234567-1"
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
              value={field.value}
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
              value={field.value}
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
              placeholder="03XXXXXXXXX"
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

        <FormField
          name="admissionDate"
          control={control}
          errors={errors}
          render={(field) => (
            <DateInput
              label="Admission Date"
              value={field.value}
              onChange={field.onChange}
              required
            />
          )}
        />

        <FormField
          name="gradeLevel"
          control={control}
          errors={errors}
          render={(field) => (
            <GradeSelector
              label="Grade Level"
              value={field.value}
              onChange={field.onChange}
              placeholder="Select grade level"
              required
            />
          )}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-5 lg:pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded-md text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md text-xs sm:text-sm hover:bg-blue-700 cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );
}
