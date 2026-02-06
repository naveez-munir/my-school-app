import { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuardianRelationship } from "~/types/student";
import type { GuardianInfoStepProps } from "~/types/student";
import { guardianSchema, type GuardianFormData } from "~/utils/validation/studentValidation";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { FormStepActions } from "~/components/common/form/FormStepActions";
import { useUniquenessValidator } from "~/hooks/useUniquenessValidator";

export function GuardianInfoStep({
  data,
  onComplete,
  onBack,
}: GuardianInfoStepProps) {
  const getInitialFormData = (): GuardianFormData => {
    return {
      name: data.guardian?.name || "",
      cniNumber: data.guardian?.cniNumber || "",
      relationship: data.guardian?.relationship || GuardianRelationship.Father,
      phone: data.guardian?.phone || "",
      email: data.guardian?.email || null,
    };
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GuardianFormData>({
    resolver: zodResolver(guardianSchema),
    defaultValues: getInitialFormData(),
  });

  const { checkCnic, checkEmail, checkPhone } = useUniquenessValidator();

  const guardianCni = useWatch({ control, name: "cniNumber" });
  const guardianEmail = useWatch({ control, name: "email" });
  const guardianPhone = useWatch({ control, name: "phone" });

  const cniMismatchError = useMemo(() => {
    if (guardianCni && data.cniNumber && guardianCni === data.cniNumber) {
      return "Guardian CNIC cannot be the same as student CNIC";
    }
    return null;
  }, [guardianCni, data.cniNumber]);

  const uniquenessErrors = useMemo(() => {
    return {
      cniNumber: guardianCni ? checkCnic(guardianCni, 'guardian').message : '',
      email: guardianEmail ? checkEmail(guardianEmail, 'guardian').message : '',
      phone: guardianPhone ? checkPhone(guardianPhone, 'guardian').message : '',
    };
  }, [guardianCni, guardianEmail, guardianPhone, checkCnic, checkEmail, checkPhone]);

  const hasUniquenessErrors = !!(cniMismatchError || uniquenessErrors.cniNumber || uniquenessErrors.email || uniquenessErrors.phone);

  useEffect(() => {
    reset(getInitialFormData());
  }, [data, reset]);

  const onSubmit = (validatedData: GuardianFormData) => {
    if (hasUniquenessErrors) return;
    onComplete({ guardian: validatedData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Guardian Name"
                value={field.value}
                onChange={field.onChange}
                required
              />
            )}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="cniNumber"
            control={control}
            render={({ field }) => (
              <TextInput
                label="CNI Number"
                value={field.value}
                onChange={field.onChange}
                placeholder="12345-1234567-1"
                required
              />
            )}
          />
          {cniMismatchError && (
            <p className="mt-1 text-sm text-red-600">{cniMismatchError}</p>
          )}
          {!cniMismatchError && uniquenessErrors.cniNumber && (
            <p className="mt-1 text-sm text-red-600">{uniquenessErrors.cniNumber}</p>
          )}
          {!cniMismatchError && !uniquenessErrors.cniNumber && errors.cniNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cniNumber.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="relationship"
            control={control}
            render={({ field }) => (
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
          {errors.relationship && (
            <p className="mt-1 text-sm text-red-600">{errors.relationship.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Phone"
                value={field.value || ""}
                onChange={field.onChange}
                type="tel"
                placeholder="03XXXXXXXXX"
                required
              />
            )}
          />
          {uniquenessErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{uniquenessErrors.phone}</p>
          )}
          {!uniquenessErrors.phone && errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
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
          {!uniquenessErrors.email && errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <FormStepActions
        onBack={onBack}
        backLabel="Previous"
        nextLabel="Next"
        isDisabled={hasUniquenessErrors}
        isFirstStep={false}
      />
    </form>
  );
}
