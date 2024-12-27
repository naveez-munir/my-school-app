import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTenant, useUpdateTenant } from '~/hooks/useTenantQueries';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import type { Tenant, TenantLeavePolicy, LeaveSettings } from '~/types/tenant';

export function meta() {
  return [
    { title: "Tenant Configuration" },
    { name: "description", content: "Configure tenant settings and policies" },
  ];
}

export default function TenantConfigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tenant, isLoading } = useTenant(id!);
  const updateTenantMutation = useUpdateTenant();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('leave-policy');
  const [formData, setFormData] = useState<{
    leavePolicy: TenantLeavePolicy;
  }>({
    leavePolicy: {
      teacherLeaveSettings: {
        sickLeaveAllowance: 12,
        casualLeaveAllowance: 12,
        earnedLeaveAllowance: 0,
        maxConsecutiveLeaves: 5,
        requireApproval: true,
        approvalWorkflow: 'principal',
        allowLeaveEncashment: false,
        notificationRecipients: ['principal', 'admin'],
      },
      staffLeaveSettings: {
        sickLeaveAllowance: 10,
        casualLeaveAllowance: 10,
        earnedLeaveAllowance: 0,
        maxConsecutiveLeaves: 5,
        requireApproval: true,
        approvalWorkflow: 'admin',
        allowLeaveEncashment: false,
        notificationRecipients: ['admin'],
      },
      leaveYearStart: { month: 1, day: 1 },
      leaveYearEnd: { month: 12, day: 31 },
      holidayList: [],
      weeklyOffDays: [0],
      allowCarryForward: false,
      maxCarryForwardDays: 0,
    }
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        leavePolicy: {
          ...formData.leavePolicy,
          ...(tenant.leavePolicy || {})
        }
      });
    }
  }, [tenant]);

  const handleSave = async () => {
    try {
      await updateTenantMutation.mutateAsync({
        id: id!,
        data: { leavePolicy: formData.leavePolicy }
      });
      toast.success('Tenant configuration updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update tenant configuration');
    }
  };

  const handleCancel = () => {
    if (tenant) {
      setFormData({
        leavePolicy: {
          ...formData.leavePolicy,
          ...(tenant.leavePolicy || {})
        }
      });
    }
    setIsEditing(false);
  };

  const updateLeaveSettings = (
    type: 'teacherLeaveSettings' | 'staffLeaveSettings',
    field: keyof LeaveSettings,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      leavePolicy: {
        ...prev.leavePolicy,
        [type]: {
          ...prev.leavePolicy[type],
          [field]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tenant configuration...</div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Tenant not found</div>
      </div>
    );
  }

  const tabs = [
    { id: 'leave-policy', name: 'Leave Policy', icon: '🏖️' },
    { id: 'academic-settings', name: 'Academic Settings', icon: '📚' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'features', name: 'Features', icon: '⚡' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/tenant-config')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tenant Config
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">
              Configure: {tenant.name}
            </h1>
            <p className="text-sm text-gray-500">
              {tenant.settings?.branding?.schoolName || 'School name not set'} • {tenant.databaseName}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateTenantMutation.isPending}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateTenantMutation.isPending ? 'Saving...' : 'Save Configuration'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Edit Configuration
            </button>
          )}
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            tenant.status === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <div>
            <h3 className="text-sm font-medium text-blue-900">
              Tenant Status: {tenant.status}
            </h3>
            <p className="text-sm text-blue-700">
              Capacity: {tenant.maxStudents} students, {tenant.maxTeachers} teachers, {tenant.maxStaff} staff
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {activeTab === 'leave-policy' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Policy Configuration</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Configure leave allowances, approval workflows, and policies for teachers and staff.
                </p>
              </div>

              {/* Teacher Leave Settings */}
              <div className="space-y-6">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">
                  Teacher Leave Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextInput
                    label="Sick Leave Days"
                    type="number"
                    value={formData.leavePolicy.teacherLeaveSettings.sickLeaveAllowance.toString()}
                    onChange={(value) => updateLeaveSettings('teacherLeaveSettings', 'sickLeaveAllowance', parseInt(value) || 0)}
                    disabled={!isEditing}
                  />
                  <TextInput
                    label="Casual Leave Days"
                    type="number"
                    value={formData.leavePolicy.teacherLeaveSettings.casualLeaveAllowance.toString()}
                    onChange={(value) => updateLeaveSettings('teacherLeaveSettings', 'casualLeaveAllowance', parseInt(value) || 0)}
                    disabled={!isEditing}
                  />
                  <TextInput
                    label="Earned Leave Days"
                    type="number"
                    value={formData.leavePolicy.teacherLeaveSettings.earnedLeaveAllowance.toString()}
                    onChange={(value) => updateLeaveSettings('teacherLeaveSettings', 'earnedLeaveAllowance', parseInt(value) || 0)}
                    disabled={!isEditing}
                  />
                  <TextInput
                    label="Max Consecutive Days"
                    type="number"
                    value={formData.leavePolicy.teacherLeaveSettings.maxConsecutiveLeaves.toString()}
                    onChange={(value) => updateLeaveSettings('teacherLeaveSettings', 'maxConsecutiveLeaves', parseInt(value) || 0)}
                    disabled={!isEditing}
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Approval Workflow
                    </label>
                    <select
                      value={formData.leavePolicy.teacherLeaveSettings.approvalWorkflow}
                      onChange={(e) => updateLeaveSettings('teacherLeaveSettings', 'approvalWorkflow', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50"
                    >
                      <option value="principal">Principal</option>
                      <option value="admin">Admin</option>
                      <option value="hr">HR Department</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Require Approval</h5>
                      <p className="text-sm text-gray-500">All leave requests need approval</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.leavePolicy.teacherLeaveSettings.requireApproval}
                      onChange={(e) => updateLeaveSettings('teacherLeaveSettings', 'requireApproval', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Allow Leave Encashment</h5>
                      <p className="text-sm text-gray-500">Teachers can encash unused leaves</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.leavePolicy.teacherLeaveSettings.allowLeaveEncashment}
                      onChange={(e) => updateLeaveSettings('teacherLeaveSettings', 'allowLeaveEncashment', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Staff Leave Settings */}
              <div className="space-y-6">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">
                  Staff Leave Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextInput
                    label="Sick Leave Days"
                    type="number"
                    value={formData.leavePolicy.staffLeaveSettings.sickLeaveAllowance.toString()}
                    onChange={(value) => updateLeaveSettings('staffLeaveSettings', 'sickLeaveAllowance', parseInt(value) || 0)}
                    disabled={!isEditing}
                  />
                  <TextInput
                    label="Casual Leave Days"
                    type="number"
                    value={formData.leavePolicy.staffLeaveSettings.casualLeaveAllowance.toString()}
                    onChange={(value) => updateLeaveSettings('staffLeaveSettings', 'casualLeaveAllowance', parseInt(value) || 0)}
                    disabled={!isEditing}
                  />
                  <TextInput
                    label="Earned Leave Days"
                    type="number"
                    value={formData.leavePolicy.staffLeaveSettings.earnedLeaveAllowance.toString()}
                    onChange={(value) => updateLeaveSettings('staffLeaveSettings', 'earnedLeaveAllowance', parseInt(value) || 0)}
                    disabled={!isEditing}
                  />
                  <TextInput
                    label="Max Consecutive Days"
                    type="number"
                    value={formData.leavePolicy.staffLeaveSettings.maxConsecutiveLeaves.toString()}
                    onChange={(value) => updateLeaveSettings('staffLeaveSettings', 'maxConsecutiveLeaves', parseInt(value) || 0)}
                    disabled={!isEditing}
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Approval Workflow
                    </label>
                    <select
                      value={formData.leavePolicy.staffLeaveSettings.approvalWorkflow}
                      onChange={(e) => updateLeaveSettings('staffLeaveSettings', 'approvalWorkflow', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50"
                    >
                      <option value="admin">Admin</option>
                      <option value="principal">Principal</option>
                      <option value="hr">HR Department</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Require Approval</h5>
                      <p className="text-sm text-gray-500">All leave requests need approval</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.leavePolicy.staffLeaveSettings.requireApproval}
                      onChange={(e) => updateLeaveSettings('staffLeaveSettings', 'requireApproval', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Allow Leave Encashment</h5>
                      <p className="text-sm text-gray-500">Staff can encash unused leaves</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.leavePolicy.staffLeaveSettings.allowLeaveEncashment}
                      onChange={(e) => updateLeaveSettings('staffLeaveSettings', 'allowLeaveEncashment', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* General Leave Settings */}
              <div className="space-y-6">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">
                  General Leave Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">Allow Carry Forward</h5>
                      <p className="text-sm text-gray-500">Unused leaves can carry to next year</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.leavePolicy.allowCarryForward}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        leavePolicy: {
                          ...prev.leavePolicy,
                          allowCarryForward: e.target.checked
                        }
                      }))}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>

                  {formData.leavePolicy.allowCarryForward && (
                    <TextInput
                      label="Max Carry Forward Days"
                      type="number"
                      value={formData.leavePolicy.maxCarryForwardDays.toString()}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        leavePolicy: {
                          ...prev.leavePolicy,
                          maxCarryForwardDays: parseInt(value) || 0
                        }
                      }))}
                      disabled={!isEditing}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Leave Year Start Month"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.leavePolicy.leaveYearStart.month.toString()}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      leavePolicy: {
                        ...prev.leavePolicy,
                        leaveYearStart: {
                          ...prev.leavePolicy.leaveYearStart,
                          month: parseInt(value) || 1
                        }
                      }
                    }))}
                    disabled={!isEditing}
                  />
                  <TextInput
                    label="Leave Year Start Day"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.leavePolicy.leaveYearStart.day.toString()}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      leavePolicy: {
                        ...prev.leavePolicy,
                        leaveYearStart: {
                          ...prev.leavePolicy.leaveYearStart,
                          day: parseInt(value) || 1
                        }
                      }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic-settings' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Settings</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Configure academic year, grading system, and other academic preferences.
                </p>
              </div>

              <div className="text-center py-12">
                <div className="text-4xl mb-4">🚧</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h4>
                <p className="text-gray-500">Academic settings configuration will be available in the next update.</p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Configure email, SMS, and push notification preferences.
                </p>
              </div>

              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔔</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h4>
                <p className="text-gray-500">Notification settings will be available in the next update.</p>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Settings</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Enable or disable various system features for this tenant.
                </p>
              </div>

              <div className="text-center py-12">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h4>
                <p className="text-gray-500">Feature toggle settings will be available in the next update.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}