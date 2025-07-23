import { useEffect, useState } from "react";
import type {
  GenerateStudentFeeInput,
  BillType,
  FeeFrequency,
} from "~/types/studentFee";
import { useFeeStructures } from "~/hooks/useFeeStructureQueries";
import { ClassSelector } from "~/components/common/ClassSelector";
import { StudentSelector } from "~/components/common/StudentSelector";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { FormActions } from "~/components/common/form/FormActions";
import { monthOptions, quarterOptions } from "~/utils/studentFeeData";

interface GenerateStudentFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateStudentFeeInput) => void;
  isSubmitting?: boolean;
  academicYear: string;
}

export function GenerateStudentFeeModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  academicYear,
}: GenerateStudentFeeModalProps) {
  const currentMonth = new Date().getMonth() + 1;
  const [formData, setFormData] = useState<GenerateStudentFeeInput>({
    studentId: "",
    feeStructureId: "",
    academicYear: academicYear,
    billType: "MONTHLY" as BillType,
    billMonth: currentMonth,
    quarter: 1,
  });

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedFeeStructureYear, setSelectedFeeStructureYear] =
    useState<string>(academicYear);

  const { data: feeStructures = [] } = useFeeStructures({
    academicYear,
    classId: selectedClass,
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        studentId: "",
        feeStructureId: "",
        academicYear: academicYear,
        billType: "MONTHLY" as BillType,
        billMonth: currentMonth,
        quarter: 1,
      });
      setSelectedClass("");
      setSelectedFeeStructureYear(academicYear);
    }
  }, [isOpen, academicYear, currentMonth]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleBillTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      billType: type as BillType,
      billMonth: type === "MONTHLY" ? currentMonth : undefined,
      quarter: type === "QUARTERLY" ? 1 : undefined,
    }));
  };

  const handleFeeStructureChange = (feeStructureId: string) => {
    setFormData((prev) => ({
      ...prev,
      feeStructureId,
    }));

    const selectedFeeStructure = feeStructures.find(
      (structure) => structure._id === feeStructureId
    );

    if (selectedFeeStructure) {
      setFormData((prev) => ({
        ...prev,
        academicYear: selectedFeeStructure.academicYear,
      }));
      setSelectedFeeStructureYear(selectedFeeStructure.academicYear);
    }
  };

  const billTypeOptions = {
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    ONE_TIME: "One Time",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-3xl border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">Generate Student Fee</h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <ClassSelector
              label="Class"
              value={selectedClass}
              onChange={(classId) => setSelectedClass(classId)}
              placeholder="Select class first"
              required
              disabled={isSubmitting}
            />

            <StudentSelector
              label="Student"
              value={formData.studentId}
              onChange={(studentId) =>
                setFormData((prev) => ({ ...prev, studentId }))
              }
              classId={selectedClass}
              required
              disabled={!selectedClass || isSubmitting}
            />

            {feeStructures.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fee Structure <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.feeStructureId}
                  onChange={(e) => handleFeeStructureChange(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
                >
                  <option value="">Select Fee Structure</option>
                  {feeStructures.map((structure) => (
                    <option key={structure._id} value={structure._id}>
                      {structure.academicYear} - {"Fee Structure"}
                    </option>
                  ))}
                </select>
              </div>
            ) : selectedClass ? (
              <div className="bg-yellow-50 p-4 text-yellow-700 rounded">
                No fee structures found for the selected class and academic
                year.
              </div>
            ) : null}

            <TextInput
              label="Academic Year"
              value={formData.academicYear}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, academicYear: value }))
              }
              type="text"
              required
              disabled={true}
            />

            <SelectInput
              label="Bill Type"
              value={formData.billType}
              options={billTypeOptions}
              onChange={handleBillTypeChange}
              required
              disabled={isSubmitting}
            />

            {formData.billType === "MONTHLY" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.billMonth?.toString() || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      billMonth: parseInt(e.target.value),
                    }))
                  }
                  disabled={isSubmitting}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
                >
                  {Object.entries(monthOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.billType === "QUARTERLY" && (
              <SelectInput
                label="Quarter"
                value={formData.quarter?.toString() || ""}
                options={quarterOptions}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, quarter: parseInt(value) }))
                }
                required
                disabled={isSubmitting}
              />
            )}
          </div>

          <div className="mt-6">
            <FormActions
              mode="create"
              entityName="Fee"
              onCancel={onClose}
              isLoading={isSubmitting}
              onSubmit={undefined}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
