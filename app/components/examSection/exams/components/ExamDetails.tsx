import React from "react";
import { useQuery } from "@tanstack/react-query";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { DateInput } from "~/components/common/form/inputs/DateInput";
import { examTypeApi } from "~/services/examTypeApi";
import type { CreateExamDto, UpdateExamDto } from "~/types/exam";
import { ClassSelector } from "~/components/common/ClassSelector";
import { TextArea } from "~/components/common/form/inputs/TextArea";

interface ExamDetailsProps {
  formData: CreateExamDto | UpdateExamDto;
  formErrors: Record<string, string>;
  onInputChange: (name: string, value: any) => void;
}

const ExamDetails: React.FC<ExamDetailsProps> = ({
  formData,
  formErrors,
  onInputChange,
}) => {
  // Fetch exam types and classes
  const { data: examTypes = [] } = useQuery({
    queryKey: ["examTypes"],
    queryFn: () => examTypeApi.getAll(),
  });

  return (
    <div className="p-6 border-b">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Exam Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Type *
          </label>
          <select
            value={formData.examType}
            onChange={(e) => onInputChange("examType", e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              formErrors.examType ? "border-red-300" : "border-gray-300"
            } px-3 py-2`}
          >
            <option value="">Select Exam Type</option>
            {examTypes.map((type: { _id: string; name: string }) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
          {formErrors.examType && (
            <p className="mt-1 text-sm text-red-500">{formErrors.examType}</p>
          )}
        </div>

        {/* Class */}
        <ClassSelector
          value={formData.classId}
          onChange={(value) => onInputChange("classId", value)}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Academic Year */}
        <div>
          <TextInput
            label="Academic Year *"
            value={formData.academicYear as string}
            onChange={(value) => onInputChange("academicYear", value)}
            placeholder="e.g., 2024-2025"
            error={formErrors.academicYear}
          />
        </div>

        {/* Start Date */}
        <div>
          <DateInput
            label="Start Date *"
            value={formData.startDate as string}
            onChange={(value) => onInputChange("startDate", value)}
            error={formErrors.startDate}
          />
        </div>

        {/* End Date */}
        <div>
          <DateInput
            label="End Date *"
            value={formData.endDate as string}
            onChange={(value) => onInputChange("endDate", value)}
            error={formErrors.endDate}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <TextArea
          value={formData.description || ""}
          onChange={(value) => onInputChange("description", value)}
          label="Description"
          placeholder="Provide any additional details about the exam..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default ExamDetails;
