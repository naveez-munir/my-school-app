import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useStudentFees } from '~/hooks/useStudentFeeQueries';
import { usePaymentsByStudent } from '~/hooks/useFeePaymentQueries';
import { StudentFeesTable } from '~/components/Fee/studentFee/StudentFeesTable';
import { PaymentHistoryTable } from '~/components/Fee/feePayment/PaymentHistoryTable';
import { ViewFeeDetailsModal } from '~/components/Fee/studentFee/ViewFeeDetailsModal';
import LoadingSpinner from '~/components/common/ui/loader/loading';
import { InfoCard } from '~/components/student/tabs/InfoCard';
import { formatCurrency } from '~/types/studentFee';
import type { StudentFee, PopulatedStudentFee } from '~/types/studentFee';

type AnyStudentFee = StudentFee | PopulatedStudentFee;

interface GuardianFeeSectionProps {
  studentId: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function GuardianFeeSection({ studentId }: GuardianFeeSectionProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<AnyStudentFee | null>(null);

  // Fetch student fees
  const { data: fees = [], isLoading: isLoadingFees, error: feesError } = useStudentFees(studentId);

  // Fetch payment history
  const { data: payments = [], isLoading: isLoadingPayments, error: paymentsError } = usePaymentsByStudent(studentId);

  // Calculate summary statistics
  const summary = {
    totalFees: fees.length,
    totalAmount: fees.reduce((sum, fee) => sum + fee.netAmount, 0),
    totalPaid: fees.reduce((sum, fee) => sum + fee.paidAmount, 0),
    totalDue: fees.reduce((sum, fee) => sum + fee.dueAmount, 0),
    pendingCount: fees.filter(fee => fee.status === 'PENDING').length,
    overdueCount: fees.filter(fee => fee.status === 'OVERDUE').length,
    paidCount: fees.filter(fee => fee.status === 'PAID').length,
  };

  // Handler to view fee details
  const handleViewDetails = (fee: AnyStudentFee) => {
    setSelectedFee(fee);
    setIsViewDetailsModalOpen(true);
  };

  const handleDiscount = (fee: AnyStudentFee) => {
    // Not allowed for guardians
  };

  const handleCancel = (id: string) => {
    // Not allowed for guardians
  };

  const handlePay = (fee: AnyStudentFee) => {
    // Not allowed for guardians
  };

  const handleViewReceipt = (paymentId: string) => {
    // TODO: Implement receipt view later
    console.log('View receipt:', paymentId);
  };

  const TABS = [
    { name: 'Fee History', key: 'fees' },
    { name: 'Payment History', key: 'payments' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <InfoCard
          title="Total Fees"
          fields={[
            { label: 'Count', value: summary.totalFees },
            { label: 'Amount', value: formatCurrency(summary.totalAmount) },
          ]}
          showEditButton={false}
          className="bg-blue-50 border-blue-200"
        />

        <InfoCard
          title="Paid"
          fields={[
            { label: 'Count', value: summary.paidCount },
            { label: 'Amount', value: formatCurrency(summary.totalPaid), valueClassName: 'text-green-600 font-semibold' },
          ]}
          showEditButton={false}
          className="bg-green-50 border-green-200"
        />

        <InfoCard
          title="Pending"
          fields={[
            { label: 'Count', value: summary.pendingCount },
            { label: 'Amount', value: formatCurrency(summary.totalDue), valueClassName: 'text-orange-600 font-semibold' },
          ]}
          showEditButton={false}
          className="bg-orange-50 border-orange-200"
        />

        <InfoCard
          title="Overdue"
          fields={[
            { label: 'Count', value: summary.overdueCount },
            { label: 'Amount', value: formatCurrency(fees.filter(f => f.status === 'OVERDUE').reduce((sum, f) => sum + f.dueAmount, 0)), valueClassName: 'text-red-600 font-semibold' },
          ]}
          showEditButton={false}
          className="bg-red-50 border-red-200"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
          <TabList className="flex space-x-8 border-b border-gray-200 px-6">
            {TABS.map((tab) => (
              <Tab
                key={tab.key}
                className={({ selected }) =>
                  classNames(
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm outline-none',
                    selected
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="p-1 lg:p-6">
            {/* Fee History Tab */}
            <TabPanel>
              {isLoadingFees ? (
                <LoadingSpinner />
              ) : feesError ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  Error loading fees: {(feesError as Error).message}
                </div>
              ) : fees.length === 0 ? (
                <div className="bg-gray-50 p-8 text-center text-gray-500 rounded-lg">
                  No fee records found for this student.
                </div>
              ) : (
                <StudentFeesTable
                  data={fees}
                  onViewDetails={handleViewDetails}
                  onDiscount={handleDiscount}
                  onCancel={handleCancel}
                  onPay={handlePay}
                  readOnly={true}
                  hideStudentColumn={true}
                />
              )}
            </TabPanel>

            {/* Payment History Tab */}
            <TabPanel>
              {isLoadingPayments ? (
                <LoadingSpinner />
              ) : paymentsError ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  Error loading payments: {(paymentsError as Error).message}
                </div>
              ) : payments.length === 0 ? (
                <div className="bg-gray-50 p-8 text-center text-gray-500 rounded-lg">
                  No payment history found for this student.
                </div>
              ) : (
                <PaymentHistoryTable
                  payments={payments}
                  onViewReceipt={handleViewReceipt}
                  hideReceipt={true}
                />
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {/* View Fee Details Modal */}
      <ViewFeeDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false);
          setSelectedFee(null);
        }}
        fee={selectedFee}
      />
    </div>
  );
}

