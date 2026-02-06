import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { TextArea } from "~/components/common/form/inputs/TextArea";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { GradeSelector } from "~/components/common/GradeSelector";
import { FormField } from "~/components/common/form/FormField";
import { FormStepActions } from "~/components/common/form/FormStepActions";
import { Gender, BloodGroup } from "~/types/student";
import type { BasicInfoStepProps, CreateStudentDto } from "~/types/student";
import { basicInfoSchema, type BasicInfoFormData } from "~/utils/validation/studentValidation";
import { useUniquenessValidator } from "~/hooks/useUniquenessValidator";

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

  const { checkCnic, checkEmail, checkPhone } = useUniquenessValidator();

  const watchedCni = useWatch({ control, name: "cniNumber" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedPhone = useWatch({ control, name: "phone" });

  const uniquenessErrors = useMemo(() => {
    return {
      cniNumber: watchedCni ? checkCnic(watchedCni, 'student').message : '',
      email: watchedEmail ? checkEmail(watchedEmail, 'student').message : '',
      phone: watchedPhone ? checkPhone(watchedPhone, 'student').message : '',
    };
  }, [watchedCni, watchedEmail, watchedPhone, checkCnic, checkEmail, checkPhone]);

  const hasUniquenessErrors = !!(uniquenessErrors.cniNumber || uniquenessErrors.email || uniquenessErrors.phone);

  useEffect(() => {
    reset(getInitialFormData(data));
  }, [data, reset]);

  const onSubmit = (validatedData: BasicInfoFormData) => {
    if (hasUniquenessErrors) return;
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

        <div>
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
          {uniquenessErrors.cniNumber && (
            <p className="mt-1 text-sm text-red-600">{uniquenessErrors.cniNumber}</p>
          )}
        </div>

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

        <div>
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
          {uniquenessErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{uniquenessErrors.phone}</p>
          )}
        </div>

        <div>
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
          {uniquenessErrors.email && (
            <p className="mt-1 text-sm text-red-600">{uniquenessErrors.email}</p>
          )}
        </div>

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

      <FormStepActions
        onBack={onBack}
        backLabel="Back"
        nextLabel="Next"
        isFirstStep={false}
        isDisabled={hasUniquenessErrors}
      />
    </form>
  );
}
