import { useParams } from "react-router";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { TextArea } from "~/components/common/form/inputs/TextArea";
import {
  Gender,
  BloodGroup,
  type UpdatePersonalInfoDto,
} from "~/types/student";
import { useUpdatePersonalInfo } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";

export function PersonalInfoForm() {
  const { id } = useParams<{ id: string }>();

  const {
    student,
    formData,
    handleChange,
    handleSubmit,
    isLoadingStudent,
    isPending,
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

  return (
    <StudentFormLayout
      student={student}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPending}
      title="Edit Personal Information"
      description={`Update personal details for {studentName}.`}
      onSubmit={handleSubmit}
      studentId={id}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="First Name"
          value={formData.firstName || ""}
          onChange={(value) => handleChange("firstName", value)}
          required
        />

        <TextInput
          label="Last Name"
          value={formData.lastName || ""}
          onChange={(value) => handleChange("lastName", value)}
          required
        />

        <DateInput
          label="Date of Birth"
          value={formData.dateOfBirth || ""}
          onChange={(value) => handleChange("dateOfBirth", value)}
          required
        />

        <SelectInput<typeof Gender>
          label="Gender"
          value={formData.gender || Gender.Male}
          onChange={(value) => handleChange("gender", value)}
          options={Gender}
          placeholder="Select Gender"
          required
        />

        <SelectInput<typeof BloodGroup>
          label="Blood Group"
          value={formData.bloodGroup}
          onChange={(value) => handleChange("bloodGroup", value)}
          options={BloodGroup}
          placeholder="Select Blood Group"
        />

        <TextInput
          label="Phone"
          value={formData.phone || ""}
          onChange={(value) => handleChange("phone", value)}
          type="tel"
        />

        <TextInput
          label="Email"
          value={formData.email || ""}
          onChange={(value) => handleChange("email", value)}
          type="email"
        />

        <div className="md:col-span-2">
          <TextArea
            label="Address"
            value={formData.address || ""}
            onChange={(value) => handleChange("address", value)}
            rows={3}
          />
        </div>
      </div>
    </StudentFormLayout>
  );
}
