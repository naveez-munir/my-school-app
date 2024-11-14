import { useEffect, useState, useMemo, useRef } from "react";
import { type BulkGenerateStudentFeeInput, BillType } from "~/types/studentFee";
import { useFeeStructures } from "~/hooks/useFeeStructureQueries";
import { ClassSelector } from "~/components/common/ClassSelector";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { FormActions } from "~/components/common/form/FormActions";
import type { StudentResponse } from "~/types/student";
import type { ClassResponse } from "~/types/class";
import { monthOptions, quarterOptions } from "~/utils/studentFeeData";

interface BulkGenerateFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulkGenerateStudentFeeInput) => void;
  isSubmitting?: boolean;
  academicYear: string;
  students: StudentResponse[];
  classes: ClassResponse[];
}

export function BulkGenerateFeesModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  academicYear,
  students,
  classes,
}: BulkGenerateFeesModalProps) {
  const currentMonth = new Date().getMonth() + 1;
  const [formData, setFormData] = useState<BulkGenerateStudentFeeInput>({
    studentIds: [],
    feeStructureId: "",
    academicYear: academicYear || new Date().getFullYear().toString(),
    billType: "MONTHLY" as BillType,
    billMonth: currentMonth,
    quarter: 1,
  });

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedFeeStructureYear, setSelectedFeeStructureYear] =
    useState<string>(academicYear);

  const { data: feeStructures = [], isLoading: loadingFeeStructures } =
    useFeeStructures({
      academicYear,
      classId: selectedClass,
      isActive: true,
    });

  const filteredStudents = useMemo(() => {
    if (!selectedClass) return [];

    return students.filter((student) => {
      const selectedClassObj = classes.find((cls) => cls.id === selectedClass);

      if (!selectedClassObj) return false;

      if (student.classId) {
        return student.classId === selectedClass;
      }

      return (
        student.className === selectedClassObj.className &&
        (selectedClassObj.classSection
          ? student.className.includes(selectedClassObj.classSection)
          : true)
      );
    });
  }, [selectedClass, students, classes]);

  const studentIds = useMemo(() => {
    return filteredStudents.map((student) => student.id);
  }, [filteredStudents]);

  useEffect(() => {
    if (isOpen) {
      const currentMonth = new Date().getMonth() + 1;
      setFormData({
        studentIds: [],
        feeStructureId: "",
        academicYear: academicYear || new Date().getFullYear().toString(),
        billType: BillType.MONTHLY,
        billMonth: currentMonth,
        quarter: 1,
      });
      setSelectedClass("");
      setSelectedFeeStructureYear(academicYear);
    }
  }, [isOpen, academicYear]);

  const hasUpdatedIds = useRef(false);

  useEffect(() => {
    if (studentIds.length > 0 && !hasUpdatedIds.current) {
      hasUpdatedIds.current = true;
      setFormData((prev) => ({
        ...prev,
        studentIds: studentIds,
      }));
    }

    if (!selectedClass) {
      hasUpdatedIds.current = false;
    }
  }, [selectedClass, studentIds]);

  useEffect(() => {
    if (formData.feeStructureId) {
      const selectedFeeStructure = feeStructures.find(
        (structure) => structure._id === formData.feeStructureId
      );

      if (selectedFeeStructure) {
        setSelectedFeeStructureYear(selectedFeeStructure.academicYear);

        setFormData((prev) => ({
          ...prev,
          academicYear: selectedFeeStructure.academicYear,
        }));
      }
    }
  }, [formData.feeStructureId, feeStructures]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: BulkGenerateStudentFeeInput = {
      studentIds: formData.studentIds,
      feeStructureId: formData.feeStructureId,
      academicYear: formData.academicYear,
      billType: formData.billType,
      billMonth:
        formData.billType === BillType.MONTHLY ? formData.billMonth : undefined,
      quarter:
        formData.billType === BillType.QUARTERLY ? formData.quarter : undefined,
    };

    onSubmit(payload);
  };

  const handleBillTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      billType: type as BillType,
      billMonth: type === BillType.MONTHLY ? currentMonth : undefined,
      quarter: type === BillType.QUARTERLY ? 1 : undefined,
    }));
  };

  const billTypeOptions = {
    [BillType.MONTHLY]: "Monthly",
    [BillType.QUARTERLY]: "Quarterly",
    [BillType.ONE_TIME]: "ONE_TIME",
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-3xl border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">Bulk Generate Student Fees</h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <ClassSelector
              label="Class"
              value={selectedClass}
              onChange={(classId) => setSelectedClass(classId)}
              placeholder="Select class"
              required
              disabled={isSubmitting}
            />

            {feeStructures && feeStructures.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fee Structure <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.feeStructureId}
                  onChange={(e) => handleFeeStructureChange(e.target.value)}
                  disabled={isSubmitting || loadingFeeStructures}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
                >
                  <option value="">Select Fee Structure</option>
                  {feeStructures.map((structure) => (
                    <option key={structure._id} value={structure._id}>
                      {structure.academicYear} - {structure.description || "Fee Structure"}
                    </option>
                  ))}
                </select>
                {loadingFeeStructures && (
                  <p className="mt-1 text-sm text-blue-500">
                    Loading fee structures...
                  </p>
                )}
              </div>
            ) : selectedClass ? (
              <div className="bg-yellow-50 p-4 text-yellow-700 rounded">
                No fee structures found for the selected class and academic
                year.
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Students <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 p-3 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {filteredStudents.length} students selected
                  </span>
                </div>
                {filteredStudents.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="space-y-1">
                      {filteredStudents.map((student) => (
                        <li key={student.id} className="text-sm">
                          {student.name} - {student.rollNumber || "No Roll #"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {selectedClass
                      ? "No students found in the selected class."
                      : "Please select a class to view students."}
                  </p>
                )}
              </div>
            </div>

            <TextInput
              label="Academic Year"
              value={formData.academicYear}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, academicYear: value }))
              }
              type="text"
              required
              disabled={true}
              placeholder="e.g. 2024-2025"
            />

            <SelectInput
              label="Bill Type"
              value={formData.billType}
              options={billTypeOptions}
              onChange={handleBillTypeChange}
              required
              disabled={isSubmitting}
            />

            {formData.billType === BillType.MONTHLY && (
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

            {formData.billType === BillType.QUARTERLY && (
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
              entityName="Bulk Fees"
              onCancel={onClose}
              isLoading={isSubmitting}
              // onSubmit={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
