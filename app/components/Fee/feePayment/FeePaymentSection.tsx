import { useState } from "react";
import { PaymentModal } from "./PaymentModal";
import { BulkPaymentModal } from "./BulkPaymentModal";
import { ReceiptView } from "./ReceiptView";
import { PaymentReceiptPrint } from "./PaymentReceiptPrint";
import { DailyPaymentsReport } from "./DailyPaymentsReport";
import { DateRangePaymentsReport } from "./DateRangePaymentsReport";
import { PaymentsDashboard } from "./PaymentsDashboard";
import { usePaymentReceipt } from "~/hooks/useFeePaymentQueries";
import type { StudentFee } from "~/types/studentFee";

type View = "dashboard" | "daily" | "dateRange";

export function FeePaymentSection() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBulkPaymentModalOpen, setIsBulkPaymentModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  
  const [paymentData, setPaymentData] = useState<{
    studentFeeId: string;
    studentId: string;
    dueAmount: number;
  }>({
    studentFeeId: "",
    studentId: "",
    dueAmount: 0,
  });
  
  const [bulkPaymentData, setBulkPaymentData] = useState<Array<{
    studentFeeId: string;
    studentId: string;
    studentName: string;
    dueAmount: number;
    amount: number;
  }>>([]);
  
  const { data: receiptData, isLoading: receiptLoading } = usePaymentReceipt(
    selectedReceiptId || ""
  );
  
  const handleOpenPaymentModal = (fee: StudentFee) => {
    setPaymentData({
      studentFeeId: fee._id,
      studentId: fee.studentId,
      dueAmount: fee.dueAmount,
    });
    setIsPaymentModalOpen(true);
  };
  
  const handleOpenBulkPaymentModal = (fees: StudentFee[]) => {
    const paymentEntries = fees.map(fee => ({
      studentFeeId: fee._id,
      studentId: typeof fee.studentId === 'object' ? fee.studentId : fee.studentId,
      studentName: `Student ID: ${fee.studentId}`,
      dueAmount: fee.dueAmount,
      amount: fee.dueAmount,
    }));
    
    setBulkPaymentData(paymentEntries);
    setIsBulkPaymentModalOpen(true);
  };
  
  const handleViewReceipt = (paymentId: string) => {
    setSelectedReceiptId(paymentId);
  };
  
  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <PaymentsDashboard
            onNavigateToDailyReport={() => setCurrentView("daily")}
            onNavigateToDateRangeReport={() => setCurrentView("dateRange")}
          />
        );
      case "daily":
        return (
          <DailyPaymentsReport onViewReceipt={handleViewReceipt} />
        );
      case "dateRange":
        return (
          <DateRangePaymentsReport onViewReceipt={handleViewReceipt} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {currentView !== "dashboard" && (
        <button
          onClick={() => setCurrentView("dashboard")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      )}
      
      {renderCurrentView()}
      
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        studentFeeId={paymentData.studentFeeId}
        studentId={paymentData.studentId}
        dueAmount={paymentData.dueAmount}
      />
      
      <BulkPaymentModal
        isOpen={isBulkPaymentModalOpen}
        onClose={() => setIsBulkPaymentModalOpen(false)}
        studentFeePayments={bulkPaymentData}
      />
      
      {receiptData && (
        <>
          <PaymentReceiptPrint receipt={receiptData} />

          <div className="fixed inset-0 z-50 flex items-center justify-center screen-only">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setSelectedReceiptId(null)}
            ></div>

            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 z-10 relative max-h-[90vh] overflow-y-auto">
              <ReceiptView
                receipt={receiptData}
                onClose={() => setSelectedReceiptId(null)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
