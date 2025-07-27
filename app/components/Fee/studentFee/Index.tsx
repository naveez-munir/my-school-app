import { useState } from "react";
import type { 
  GenerateStudentFeeInput, 
  ApplyDiscountInput, 
  BulkGenerateStudentFeeInput,
  StudentFee,
  PopulatedStudentFee
} from "~/types/studentFee";
import { 
  useStudentFeeAnalytics,
  useGenerateStudentFee,
  useBulkGenerateStudentFees,
  useApplyDiscount,
  useCancelFee,
  useCalculateLateFees,
  useUpdateFeeStatuses
} from "~/hooks/useStudentFeeQueries";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { useClasses } from "~/hooks/useClassQueries";
import { useStudents } from "~/hooks/useStudentQueries";
import { AcademicYearSelector } from "~/components/common/AcademicYearSelector";
import { ClassSelector } from "~/components/common/ClassSelector";
import { MonthSelector } from "~/components/common/MonthSelector";
import { FeeActionButtons } from "./FeeActionButtons";
import { StudentFeeSkeleton } from "./StudentFeeSkeleton";
import { FeeStatusSummary } from "./FeeStatusSummary";
import { StudentFeesTable } from "./StudentFeesTable";
import { GenerateStudentFeeModal } from "./GenerateStudentFeeModal";
import { BulkGenerateFeesModal } from "./BulkGenerateFeesModal";
import { ApplyDiscountModal } from "./ApplyDiscountModal";

type AnyStudentFee = StudentFee | PopulatedStudentFee;

export const StudentFeeSection = () => {
  const [academicYear, setAcademicYear] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isBulkGenerateModalOpen, setIsBulkGenerateModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<AnyStudentFee | null>(null);

  const { data: students = [], isLoading: studentLoading } = useStudents();
  const { data: classes = [], isLoading: classLoading } = useClasses();

  const { 
    summary, 
    fees, 
    isLoading: feesLoading, 
    error 
  } = useStudentFeeAnalytics({academicYear,classId: selectedClassId, month: selectedMonth});

  const isLoading = studentLoading || classLoading || feesLoading;
  const hasAllData = !isLoading && students.length > 0 && classes.length > 0 && fees && fees.length > 0;

  const generateFeeMutation = useGenerateStudentFee();
  const bulkGenerateFeeMutation = useBulkGenerateStudentFees();
  const applyDiscountMutation = useApplyDiscount();
  const cancelFeeMutation = useCancelFee();
  const calculateLateFeesMutation = useCalculateLateFees();
  const updateFeeStatusesMutation = useUpdateFeeStatuses();

  const handleGenerateFee = async (data: GenerateStudentFeeInput) => {
    try {
      await generateFeeMutation.mutateAsync(data);
      setIsGenerateModalOpen(false);
    } catch (err) {
      console.error("Error generating student fee:", err);
    }
  };

  const handleBulkGenerate = async (data: BulkGenerateStudentFeeInput) => {
    try {
      await bulkGenerateFeeMutation.mutateAsync(data);
      setIsBulkGenerateModalOpen(false);
    } catch (err) {
      console.error("Error bulk generating fees:", err);
    }
  };

  const handleApplyDiscount = async (data: ApplyDiscountInput) => {
    if (selectedFee) {
      try {
        await applyDiscountMutation.mutateAsync({ 
          id: selectedFee._id, 
          data 
        });
        setIsDiscountModalOpen(false);
        setSelectedFee(null);
      } catch (err) {
        console.error("Error applying discount:", err);
      }
    }
  };

  const handleCancelFee = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this fee? This action cannot be undone.')) {
      try {
        const reason = prompt("Please provide a reason for cancellation:") || "No reason provided";
        await cancelFeeMutation.mutateAsync({ id, reason });
      } catch (err) {
        console.error("Error canceling fee:", err);
      }
    }
  };

  const handleCalculateLateFees = async () => {
    if (window.confirm('This will calculate late fees for all overdue payments. Continue?')) {
      try {
        await calculateLateFeesMutation.mutateAsync();
        alert('Late fees calculated successfully.');
      } catch (err) {
        console.error("Error calculating late fees:", err);
        alert("Failed to calculate late fees.");
      }
    }
  };

  const handleUpdateFeeStatuses = async () => {
    if (window.confirm('This will update the status of all fees based on their due dates and payment status. Continue?')) {
      try {
        await updateFeeStatusesMutation.mutateAsync();
        alert('Fee statuses updated successfully.');
      } catch (err) {
        console.error("Error updating fee statuses:", err);
        alert("Failed to update fee statuses.");
      }
    }
  };

  const clearFilters = () => {
    setAcademicYear('');
    setSelectedClassId('');
    setSelectedMonth(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Student Fee Management
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Generate Fee
          </button>
          <button
            onClick={() => setIsBulkGenerateModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Bulk Generate
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AcademicYearSelector
            value={academicYear}
            onChange={setAcademicYear}
            className="md:col-span-1"
          />
          
          <ClassSelector
            value={selectedClassId}
            onChange={setSelectedClassId}
            className="md:col-span-1"
          />
          
          <MonthSelector
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="md:col-span-1"
          />
          
          <div className="md:col-span-1 flex items-end">
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <FeeActionButtons 
            onCalculateLateFees={handleCalculateLateFees}
            onUpdateFeeStatuses={handleUpdateFeeStatuses}
            isCalculating={calculateLateFeesMutation.isPending}
            isUpdating={updateFeeStatusesMutation.isPending}
          />
        </div>
      </div>

      {isLoading ? (
        <StudentFeeSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : !hasAllData ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          No data available. Please ensure you have students, classes, and fees data.
        </div>
      ) : (
        <>
          <FeeStatusSummary summary={summary || { totalPending: 0, totalOverdue: 0, count: 0 }} />
          
          <StudentFeesTable
            data={fees}
            onDiscount={(fee: AnyStudentFee) => {
              setSelectedFee(fee);
              setIsDiscountModalOpen(true);
            }}
            students={students}
            classes={classes}
            onCancel={handleCancelFee}
          />
        </>
      )}

      <GenerateStudentFeeModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSubmit={handleGenerateFee}
        isSubmitting={generateFeeMutation.isPending}
        academicYear={academicYear}
      />

      <BulkGenerateFeesModal
        isOpen={isBulkGenerateModalOpen}
        onClose={() => setIsBulkGenerateModalOpen(false)}
        onSubmit={handleBulkGenerate}
        isSubmitting={bulkGenerateFeeMutation.isPending}
        academicYear={academicYear}
        students={students}
        classes={classes}
      />

      <ApplyDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => {
          setIsDiscountModalOpen(false);
          setSelectedFee(null);
        }}
        onSubmit={handleApplyDiscount}
        fee={selectedFee}
        isSubmitting={applyDiscountMutation.isPending}
      />
    </div>
  );
};
