interface PaymentOverrideToggleProps {
  enabled: boolean;
  isPaid: boolean;
  reason: string;
  onEnabledChange: (enabled: boolean) => void;
  onIsPaidChange: (isPaid: boolean) => void;
  onReasonChange: (reason: string) => void;
  currentPaidStatus?: boolean;
}

export function PaymentOverrideToggle({
  enabled,
  isPaid,
  reason,
  onEnabledChange,
  onIsPaidChange,
  onReasonChange,
  currentPaidStatus,
}: PaymentOverrideToggleProps) {
  return (
    <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 space-y-3">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="override-toggle"
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
          />
        </div>
        <div className="ml-3">
          <label htmlFor="override-toggle" className="font-medium text-sm text-gray-900">
            Override Payment Status
          </label>
          <p className="text-xs text-gray-600 mt-0.5">
            Manually set whether this leave should be paid or unpaid
            {currentPaidStatus !== undefined && (
              <span className="ml-1 font-medium">
                (Current: {currentPaidStatus ? 'Paid' : 'Unpaid'})
              </span>
            )}
          </p>
        </div>
      </div>

      {enabled && (
        <div className="space-y-3 pl-7">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={isPaid}
                  onChange={() => onIsPaidChange(true)}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">✅ Paid Leave</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={!isPaid}
                  onChange={() => onIsPaidChange(false)}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">❌ Unpaid Leave</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="override-reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reason for Override
            </label>
            <textarea
              id="override-reason"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              rows={2}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:ring-amber-500"
              placeholder="e.g., Special circumstances, medical emergency, policy exception..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Provide justification for this override (recommended for audit trail)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
