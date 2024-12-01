import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLeavePolicy, useUpdateLeavePolicy } from '~/hooks/useTenantSettings';
import { LeaveSettingsCard } from './LeaveSettingsCard';
import { HolidayCalendar } from './HolidayCalendar';
import { WeeklyOffSelector } from './WeeklyOffSelector';
import type { LeavePolicy } from '~/services/tenantSettingsApi';

export function LeavePolicySettings() {
  const { data: leavePolicy, isLoading } = useLeavePolicy();
  const updateMutation = useUpdateLeavePolicy();

  const [formData, setFormData] = useState<LeavePolicy | null>(null);

  useEffect(() => {
    if (leavePolicy) {
      setFormData(leavePolicy);
    }
  }, [leavePolicy]);

  const handleSave = async () => {
    if (!formData) return;

    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Leave policy updated successfully');
    } catch (error) {
      toast.error('Failed to update leave policy');
    }
  };

  const handleCancel = () => {
    if (leavePolicy) {
      setFormData(leavePolicy);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading leave policy...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LeaveSettingsCard
        title="🎓 Teacher Leave Settings"
        settings={formData.teacherLeaveSettings}
        onChange={(settings) =>
          setFormData({ ...formData, teacherLeaveSettings: settings })
        }
      />

      <LeaveSettingsCard
        title="👔 Staff Leave Settings"
        settings={formData.staffLeaveSettings}
        onChange={(settings) =>
          setFormData({ ...formData, staffLeaveSettings: settings })
        }
      />

      <HolidayCalendar
        holidays={formData.holidayList || []}
        onChange={(holidays) =>
          setFormData({ ...formData, holidayList: holidays })
        }
      />

      <WeeklyOffSelector
        selectedDays={formData.weeklyOffDays || []}
        onChange={(days) =>
          setFormData({ ...formData, weeklyOffDays: days })
        }
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.allowCarryForward || false}
            onChange={(e) =>
              setFormData({ ...formData, allowCarryForward: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Allow Carry Forward</span>
        </label>

        {formData.allowCarryForward && (
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Max Carry Forward Days
            </label>
            <input
              type="number"
              value={formData.maxCarryForwardDays || 0}
              onChange={(e) =>
                setFormData({ ...formData, maxCarryForwardDays: parseInt(e.target.value) || 0 })
              }
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="30"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
