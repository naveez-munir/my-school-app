import type { LeaveSettings } from '~/services/tenantSettingsApi';

interface LeaveSettingsCardProps {
  title: string;
  settings: LeaveSettings;
  onChange: (settings: LeaveSettings) => void;
}

export function LeaveSettingsCard({ title, settings, onChange }: LeaveSettingsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Sick Leave Days
          </label>
          <input
            type="number"
            value={settings.sickLeaveAllowance}
            onChange={(e) =>
              onChange({ ...settings, sickLeaveAllowance: parseInt(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Casual Leave Days
          </label>
          <input
            type="number"
            value={settings.casualLeaveAllowance}
            onChange={(e) =>
              onChange({ ...settings, casualLeaveAllowance: parseInt(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Earned Leave Days
          </label>
          <input
            type="number"
            value={settings.earnedLeaveAllowance}
            onChange={(e) =>
              onChange({ ...settings, earnedLeaveAllowance: parseInt(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Max Consecutive Days
          </label>
          <input
            type="number"
            value={settings.maxConsecutiveLeaves}
            onChange={(e) =>
              onChange({ ...settings, maxConsecutiveLeaves: parseInt(e.target.value) || 1 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="10"
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.requireApproval}
            onChange={(e) =>
              onChange({ ...settings, requireApproval: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Require Approval</span>
        </label>

        {settings.requireApproval && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Approver Role
            </label>
            <select
              value={settings.approvalWorkflow}
              onChange={(e) =>
                onChange({ ...settings, approvalWorkflow: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="principal">Principal</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.allowLeaveEncashment}
            onChange={(e) =>
              onChange({ ...settings, allowLeaveEncashment: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Allow Leave Encashment</span>
        </label>
      </div>
    </div>
  );
}
