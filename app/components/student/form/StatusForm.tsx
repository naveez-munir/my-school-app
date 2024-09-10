import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { TextArea } from "~/components/common/form/inputs/TextArea";
import { FormField } from "~/components/common/form/FormField";
import {
  StudentStatus,
  ExitStatus,
  type UpdateStatusDto,
} from "~/types/student";
import { useUpdateStudentStatus } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";
import { updateStatusSchema, type UpdateStatusFormData } from "~/utils/validation/studentValidation";

export function StatusForm() {
  const { id } = useParams<{ id: string }>();

  const {
    student,
    formData,
    setFormData,
    isLoadingStudent,
    isPending,
    handleSubmit: submitToApi,
  } = useStudentForm<UpdateStatusDto>({
    initialDataMapper: (student) => ({
      status: student.status || StudentStatus.Active,
      exitStatus: student.exitStatus || ExitStatus.None,
      exitDate: student.exitDate || null,
      exitRemarks: student.exitRemarks || null,
    }),
    defaultData: {
      status: StudentStatus.Active,
      exitStatus: ExitStatus.None,
      exitDate: null,
      exitRemarks: null,
    },
    mutationHook: useUpdateStudentStatus,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateStatusFormData>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: formData,
  });

  const exitStatus = watch("exitStatus");
  const [showExitFields, setShowExitFields] = useState<boolean>(
    exitStatus !== ExitStatus.None
  );

  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  useEffect(() => {
    setShowExitFields(exitStatus !== ExitStatus.None);
  }, [exitStatus]);

  const onSubmit = async (validatedData: UpdateStatusFormData) => {
    const dataToSubmit: UpdateStatusDto = {
      ...validatedData,
      exitDate: validatedData.exitStatus === ExitStatus.None ? null : validatedData.exitDate,
      exitRemarks: validatedData.exitStatus === ExitStatus.None ? null : validatedData.exitRemarks,
    };
    setFormData(dataToSubmit);
    await submitToApi(dataToSubmit);
  };

  return (
    <StudentFormLayout
      student={student}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPending}
      title="Edit Student Status"
      description={`Update status information for {studentName}.`}
      onSubmit={handleSubmit(onSubmit)}
      studentId={id}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="status"
          control={control}
          errors={errors}
          render={(field) => (
            <SelectInput<typeof StudentStatus>
              label="Student Status"
              value={field.value}
              onChange={field.onChange}
              options={StudentStatus}
              placeholder="Select Status"
              required
            />
          )}
        />

        <FormField
          name="exitStatus"
          control={control}
          errors={errors}
          render={(field) => (
            <SelectInput<typeof ExitStatus>
              label="Exit Status"
              value={field.value || ExitStatus.None}
              onChange={field.onChange}
              options={ExitStatus}
              placeholder="Select Exit Status"
            />
          )}
        />

        {showExitFields && (
          <>
            <FormField
              name="exitDate"
              control={control}
              errors={errors}
              render={(field) => (
                <DateInput
                  label="Exit Date"
                  value={field.value || ""}
                  onChange={field.onChange}
                  required={showExitFields}
                />
              )}
            />

            <div className="md:col-span-2">
              <FormField
                name="exitRemarks"
                control={control}
                errors={errors}
                render={(field) => (
                  <TextArea
                    label="Exit Remarks"
                    value={field.value || ""}
                    onChange={field.onChange}
                    rows={3}
                    placeholder="Reason for leaving the school"
                  />
                )}
              />
            </div>
          </>
        )}
      </div>
    </StudentFormLayout>
  );
}
