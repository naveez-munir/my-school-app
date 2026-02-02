import type { ModalState } from '~/hooks/useStudentFeeModals';
import type {
  PopulatedStudentFee,
  GenerateStudentFeeInput,
  BulkGenerateStudentFeeInput,
  ApplyDiscountInput,
  CreateAdhocFeeInput,
  StudentFeeSettlementInput,
  StudentClassTransferInput,
  SettlementSummary,
  TransferSummary,
} from '~/types/studentFee';
import { getStudentIdValue, getStudentDisplayName } from '~/types/studentFee';
import type { RecurringFeeData } from './GenerateRecurringFeesModal';
import { GenerateStudentFeeModal } from './GenerateStudentFeeModal';
import { BulkGenerateFeesModal } from './BulkGenerateFeesModal';
import { ApplyDiscountModal } from './ApplyDiscountModal';
import { CancelFeeModal } from './CancelFeeModal';
import { ViewFeeDetailsModal } from './ViewFeeDetailsModal';
import { ConfirmActionModal } from './ConfirmActionModal';
import { GenerateRecurringFeesModal } from './GenerateRecurringFeesModal';
import { PaymentModal } from '../feePayment/PaymentModal';
import { BulkPaymentModal } from '../feePayment/BulkPaymentModal';
import { CreateAdhocFeeModal } from './CreateAdhocFeeModal';
import { SettleStudentFeesModal } from './SettleStudentFeesModal';
import { ClassTransferModal } from './ClassTransferModal';

interface StudentFeeModalsProps {
  modalState: ModalState;
  onClose: () => void;
  academicYear: string;
  selectedMonth?: number;
  fees: PopulatedStudentFee[];
  selectedFeeIds: Set<string>;
  students: any[];
  classes: any[];
  onGenerateFee: (data: GenerateStudentFeeInput) => Promise<void>;
  onBulkGenerate: (data: BulkGenerateStudentFeeInput) => Promise<void>;
  onApplyDiscount: (data: ApplyDiscountInput) => Promise<void>;
  onCancelFee: (reason: string) => Promise<void>;
  onConfirmAction: () => Promise<void>;
  onGenerateRecurring: (data: RecurringFeeData) => Promise<void>;
  onCreateAdhocFee: (data: CreateAdhocFeeInput) => Promise<void>;
  onSettleStudentFees: (data: StudentFeeSettlementInput) => Promise<SettlementSummary>;
  onClassTransfer: (data: StudentClassTransferInput) => Promise<TransferSummary>;
  onClearSelectedFees: () => void;
  isGenerating: boolean;
  isBulkGenerating: boolean;
  isApplyingDiscount: boolean;
  isCancelling: boolean;
  isConfirmActionLoading: boolean;
  isGeneratingRecurring: boolean;
  isCreatingAdhoc: boolean;
  isSettling: boolean;
  isTransferring: boolean;
}

export function StudentFeeModals({
  modalState,
  onClose,
  academicYear,
  selectedMonth,
  fees,
  selectedFeeIds,
  students,
  classes,
  onGenerateFee,
  onBulkGenerate,
  onApplyDiscount,
  onCancelFee,
  onConfirmAction,
  onGenerateRecurring,
  onCreateAdhocFee,
  onSettleStudentFees,
  onClassTransfer,
  onClearSelectedFees,
  isGenerating,
  isBulkGenerating,
  isApplyingDiscount,
  isCancelling,
  isConfirmActionLoading,
  isGeneratingRecurring,
  isCreatingAdhoc,
  isSettling,
  isTransferring,
}: StudentFeeModalsProps) {
  const isConfirmLateFees = modalState.modal === 'confirmLateFees';
  const isConfirmUpdateStatuses = modalState.modal === 'confirmUpdateStatuses';

  return (
    <>
      <GenerateStudentFeeModal
        isOpen={modalState.modal === 'generate'}
        onClose={onClose}
        onSubmit={onGenerateFee}
        isSubmitting={isGenerating}
        academicYear={academicYear}
      />

      <BulkGenerateFeesModal
        isOpen={modalState.modal === 'bulkGenerate'}
        onClose={onClose}
        onSubmit={onBulkGenerate}
        isSubmitting={isBulkGenerating}
        academicYear={academicYear}
        students={students}
        classes={classes}
      />

      <ApplyDiscountModal
        isOpen={modalState.modal === 'discount'}
        onClose={onClose}
        onSubmit={onApplyDiscount}
        fee={modalState.modal === 'discount' ? modalState.fee : null}
        isSubmitting={isApplyingDiscount}
      />

      <CancelFeeModal
        isOpen={modalState.modal === 'cancel'}
        onClose={onClose}
        onConfirm={onCancelFee}
        isSubmitting={isCancelling}
      />

      <ViewFeeDetailsModal
        isOpen={modalState.modal === 'viewDetails'}
        onClose={onClose}
        fee={modalState.modal === 'viewDetails' ? modalState.fee : null}
      />

      <ConfirmActionModal
        isOpen={isConfirmLateFees || isConfirmUpdateStatuses}
        onClose={onClose}
        onConfirm={onConfirmAction}
        title={isConfirmLateFees ? 'Calculate Late Fees' : 'Update Fee Statuses'}
        message={isConfirmLateFees
          ? 'This will calculate late fees for all overdue payments. Continue?'
          : 'This will update the status of all fees based on their due dates and payment status. Continue?'}
        confirmText="Continue"
        isLoading={isConfirmActionLoading}
      />

      <GenerateRecurringFeesModal
        isOpen={modalState.modal === 'recurring'}
        onClose={onClose}
        onConfirm={onGenerateRecurring}
        currentFilters={{ academicYear, month: selectedMonth }}
        isLoading={isGeneratingRecurring}
        classesRequiringSelection={modalState.modal === 'recurring' ? modalState.classesRequiringSelection : []}
      />

      {modalState.modal === 'payment' && (
        <PaymentModal
          isOpen
          onClose={onClose}
          studentFeeId={modalState.fee._id}
          studentId={getStudentIdValue(modalState.fee)}
          dueAmount={modalState.fee.dueAmount}
        />
      )}

      <BulkPaymentModal
        isOpen={modalState.modal === 'bulkPayment'}
        onClose={() => {
          onClearSelectedFees();
          onClose();
        }}
        studentFeePayments={(fees || [])
          .filter(fee => selectedFeeIds.has(fee._id))
          .map(fee => ({
            studentFeeId: fee._id,
            studentId: getStudentIdValue(fee),
            studentName: getStudentDisplayName(fee),
            dueAmount: fee.dueAmount,
            amount: fee.dueAmount,
          }))}
      />

      <CreateAdhocFeeModal
        isOpen={modalState.modal === 'adhoc'}
        onClose={onClose}
        onSubmit={onCreateAdhocFee}
        isSubmitting={isCreatingAdhoc}
        academicYear={academicYear}
      />

      {modalState.modal === 'settlement' && (
        <SettleStudentFeesModal
          isOpen
          onClose={onClose}
          onSubmit={onSettleStudentFees}
          isSubmitting={isSettling}
          studentName={modalState.student.name}
        />
      )}

      {modalState.modal === 'transfer' && (
        <ClassTransferModal
          isOpen
          onClose={onClose}
          onSubmit={onClassTransfer}
          isSubmitting={isTransferring}
          studentName={modalState.student.name}
          currentClassId={modalState.student.classId}
        />
      )}
    </>
  );
}
