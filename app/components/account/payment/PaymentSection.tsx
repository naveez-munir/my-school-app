import { useState } from 'react';
import { PaymentsTable } from './PaymentsTable';
import { PaymentDetailModal } from './PaymentDetailModal';
import { PaymentDashboard } from './PaymentDashboard';
import {
  type Payment,
  PaymentStatus,
  PaymentType,
  PaymentMode,
  PaymentFor,
  type SearchPaymentParams
} from '~/types/payment.types';
import {
  usePayments,
} from '~/hooks/usePayment';
import { BarChart3, List } from 'lucide-react';
import { PaymentTypeSelector } from '~/components/common/PaymentTypeSelector';
import { PaymentStatusSelector } from '~/components/common/PaymentStatusSelector';
import { PaymentModeSelector } from '~/components/common/PaymentModeSelector';

type TabType = 'dashboard' | 'history';

export const PaymentSection = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // State for modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // State for selected payment and filters
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filters, setFilters] = useState<SearchPaymentParams>({});

  // React Query hooks
  const {
    data: payments = [],
    isLoading,
    error
  } = usePayments(filters);

  // Handle viewing a payment
  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  // Handler for filter changes
  const handleFilterChange = (field: keyof SearchPaymentParams, value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      const newFilters = { ...filters };
      delete newFilters[field];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Payment Management</h1>
            <p className="text-gray-600 text-sm">
              Comprehensive payment tracking and analytics dashboard
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center border border-gray-300 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-500">Total Modules</div>
              <div className="text-2xl font-bold text-gray-800">3</div>
              <div className="text-xs text-gray-600">Fee • Salary • Expense</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View payment statistics and transaction history. Payments are created from their respective modules.
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <List className="h-5 w-5 mr-2" />
              Transaction History
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' ? (
        <PaymentDashboard />
      ) : (
        <>
          <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PaymentTypeSelector
            value={filters.paymentType as any}
            onChange={(value) => handleFilterChange('paymentType', value === 'all' ? undefined : value)}
            label="Filter by Type"
            placeholder="All Types"
            includeAll={true}
          />

          <PaymentStatusSelector
            value={filters.status as any}
            onChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
            label="Filter by Status"
            placeholder="All Statuses"
            includeAll={true}
          />

          <PaymentModeSelector
            value={filters.paymentMode as any}
            onChange={(value) => handleFilterChange('paymentMode', value === 'all' ? undefined : value)}
            label="Filter by Payment Mode"
            placeholder="All Modes"
            includeAll={true}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate || ''}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate || ''}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference ID
            </label>
            <input
              type="text"
              value={filters.referenceId || ''}
              onChange={(e) => handleFilterChange('referenceId', e.target.value)}
              placeholder="Enter reference ID"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            />
          </div>
        </div>
      </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-500">Loading payments...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
          ) : (
            <PaymentsTable
              data={payments}
              onView={handleView}
            />
          )}

          <PaymentDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedPayment(null);
            }}
            payment={selectedPayment}
          />
        </>
      )}
    </div>
  );
};
