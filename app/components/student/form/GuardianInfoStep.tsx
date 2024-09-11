import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuardianRelationship } from "~/types/student";
import type { GuardianInfoStepProps } from "~/types/student";
import { guardianSchema, type GuardianFormData } from "~/utils/validation/studentValidation";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";

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

  useEffect(() => {
    reset(getInitialFormData());
  }, [data, reset]);

  const onSubmit = (validatedData: GuardianFormData) => {
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
          {errors.cniNumber && (
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
          {errors.phone && (
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
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-5 lg:pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded-md text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Previous
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
