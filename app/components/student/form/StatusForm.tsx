import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { TextArea } from "~/components/common/form/inputs/TextArea";
import {
  StudentStatus,
  ExitStatus,
  type UpdateStatusDto,
} from "~/types/student";
import { useUpdateStudentStatus } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";

export function StatusForm() {
  const { id } = useParams<{ id: string }>();

  const {
    student,
    formData,
    handleChange,
    setFormData,
    handleSubmit: baseHandleSubmit,
    isLoadingStudent,
    isPending,
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

  const [showExitFields, setShowExitFields] = useState<boolean>(
    formData.exitStatus !== ExitStatus.None
  );

  useEffect(() => {
    setShowExitFields(formData.exitStatus !== ExitStatus.None);
  }, [formData.exitStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: UpdateStatusDto = {
      ...formData,
      exitDate:
        formData.exitStatus === ExitStatus.None ? null : formData.exitDate,
      exitRemarks:
        formData.exitStatus === ExitStatus.None ? null : formData.exitRemarks,
    };
    setFormData(dataToSubmit);
    baseHandleSubmit(e);
  };

  return (
    <StudentFormLayout
      student={student}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPending}
      title="Edit Student Status"
      description={`Update status information for {studentName}.`}
      onSubmit={handleSubmit}
      studentId={id}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput<typeof StudentStatus>
          label="Student Status"
          value={formData.status}
          onChange={(value) => handleChange("status", value)}
          options={StudentStatus}
          placeholder="Select Status"
          required
        />

        <SelectInput<typeof ExitStatus>
          label="Exit Status"
          value={formData.exitStatus || ExitStatus.None}
          onChange={(value) => handleChange("exitStatus", value)}
          options={ExitStatus}
          placeholder="Select Exit Status"
        />

        {showExitFields && (
          <>
            <DateInput
              label="Exit Date"
              value={formData.exitDate || ""}
              onChange={(value) => handleChange("exitDate", value)}
              required={showExitFields}
            />

            <div className="md:col-span-2">
              <TextArea
                label="Exit Remarks"
                value={formData.exitRemarks || ""}
                onChange={(value) => handleChange("exitRemarks", value)}
                rows={3}
                placeholder="Reason for leaving the school"
              />
            </div>
          </>
        )}
      </div>
    </StudentFormLayout>
  );
}
