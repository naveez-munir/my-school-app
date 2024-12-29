import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTenant, useUpdateTenant } from '~/hooks/useTenantQueries';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { TenantStatus, type Tenant } from '~/types/tenant';

export function meta() {
  return [
    { title: "Tenant Details" },
    { name: "description", content: "View and edit tenant details and settings" },
  ];
}

interface TenantSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
  };
  branding: {
    schoolName: string;
    schoolAddress: string;
    contactInfo: string;
    website: string;
  };
  features: {
    enableOnlinePayments: boolean;
    enableParentPortal: boolean;
    enableStudentPortal: boolean;
    enableNotifications: boolean;
    enableReports: boolean;
  };
  academic: {
    academicYearStart: string;
    academicYearEnd: string;
    gradingSystem: string;
    timeZone: string;
  };
}

export default function TenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tenant, isLoading } = useTenant(id!);
  const updateTenantMutation = useUpdateTenant();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    databaseName: string;
    status: TenantStatus;
    maxStudents: number;
    maxTeachers: number;
    maxStaff: number;
    settings: TenantSettings;
  }>({
    name: '',
    databaseName: '',
    status: TenantStatus.Active,
    maxStudents: 150,
    maxTeachers: 10,
    maxStaff: 5,
    settings: {
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        logo: '',
        favicon: ''
      },
      branding: {
        schoolName: '',
        schoolAddress: '',
        contactInfo: '',
        website: ''
      },
      features: {
        enableOnlinePayments: true,
        enableParentPortal: true,
        enableStudentPortal: true,
        enableNotifications: true,
        enableReports: true
      },
      academic: {
        academicYearStart: '',
        academicYearEnd: '',
        gradingSystem: 'A-F',
        timeZone: 'UTC'
      }
    }
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        databaseName: tenant.databaseName,
        status: tenant.status,
        maxStudents: tenant.maxStudents,
        maxTeachers: tenant.maxTeachers,
        maxStaff: tenant.maxStaff,
        settings: {
          ...formData.settings,
          ...(tenant.settings || {})
        }
      });
    }
  }, [tenant]);

  const handleSave = async () => {
    try {
      await updateTenantMutation.mutateAsync({
        id: id!,
        data: formData
      });
      toast.success('Tenant updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update tenant');
    }
  };

  const handleCancel = () => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        databaseName: tenant.databaseName,
        status: tenant.status,
        maxStudents: tenant.maxStudents,
        maxTeachers: tenant.maxTeachers,
        maxStaff: tenant.maxStaff,
        settings: {
          ...formData.settings,
          ...(tenant.settings || {})
        }
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tenant details...</div>
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

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/tenants')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tenants
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">
              {tenant.name}
            </h1>
            <p className="text-sm text-gray-500">
              Database: {tenant.databaseName}
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
                {updateTenantMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Edit Tenant
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
            Basic Settings
          </button>
        </nav>
      </div>

      {/* Basic Settings Tab */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Tenant Name"
                value={formData.name}
                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                disabled={!isEditing}
                required
              />
              <TextInput
                label="Database Name"
                value={formData.databaseName}
                onChange={(value) => setFormData(prev => ({ ...prev, databaseName: value }))}
                disabled={true} // Database name should never be editable
                required
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TenantStatus }))}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50"
                >
                  <option value={TenantStatus.Active}>Active</option>
                  <option value={TenantStatus.Inactive}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Capacity Limits */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Capacity Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextInput
                label="Max Students"
                type="number"
                value={formData.maxStudents.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, maxStudents: parseInt(value) || 0 }))}
                disabled={!isEditing}
                required
              />
              <TextInput
                label="Max Teachers"
                type="number"
                value={formData.maxTeachers.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, maxTeachers: parseInt(value) || 0 }))}
                disabled={!isEditing}
                required
              />
              <TextInput
                label="Max Staff"
                type="number"
                value={formData.maxStaff.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, maxStaff: parseInt(value) || 0 }))}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          {/* Theme Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Theme & Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Primary Color"
                type="color"
                value={formData.settings.theme.primaryColor}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    theme: {
                      ...prev.settings.theme,
                      primaryColor: value
                    }
                  }
                }))}
                disabled={!isEditing}
              />
              <TextInput
                label="Secondary Color"
                type="color"
                value={formData.settings.theme.secondaryColor}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    theme: {
                      ...prev.settings.theme,
                      secondaryColor: value
                    }
                  }
                }))}
                disabled={!isEditing}
              />
              <TextInput
                label="School Name"
                value={formData.settings.branding.schoolName}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    branding: {
                      ...prev.settings.branding,
                      schoolName: value
                    }
                  }
                }))}
                disabled={!isEditing}
              />
              <TextInput
                label="Website"
                value={formData.settings.branding.website}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    branding: {
                      ...prev.settings.branding,
                      website: value
                    }
                  }
                }))}
                disabled={!isEditing}
              />
            </div>
            <TextInput
              label="School Address"
              value={formData.settings.branding.schoolAddress}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  branding: {
                    ...prev.settings.branding,
                    schoolAddress: value
                  }
                }
              }))}
              disabled={!isEditing}
            />
            <TextInput
              label="Contact Information"
              value={formData.settings.branding.contactInfo}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  branding: {
                    ...prev.settings.branding,
                    contactInfo: value
                  }
                }
              }))}
              disabled={!isEditing}
            />
          </div>

          {/* Feature Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Feature Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData.settings.features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        features: {
                          ...prev.settings.features,
                          [key]: e.target.checked
                        }
                      }
                    }))}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Academic Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Academic Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Academic Year Start"
                type="date"
                value={formData.settings.academic.academicYearStart}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    academic: {
                      ...prev.settings.academic,
                      academicYearStart: value
                    }
                  }
                }))}
                disabled={!isEditing}
              />
              <TextInput
                label="Academic Year End"
                type="date"
                value={formData.settings.academic.academicYearEnd}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    academic: {
                      ...prev.settings.academic,
                      academicYearEnd: value
                    }
                  }
                }))}
                disabled={!isEditing}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Grading System
                </label>
                <select
                  value={formData.settings.academic.gradingSystem}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      academic: {
                        ...prev.settings.academic,
                        gradingSystem: e.target.value
                      }
                    }
                  }))}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50"
                >
                  <option value="A-F">A-F Grading</option>
                  <option value="1-10">1-10 Scale</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <TextInput
                label="Time Zone"
                value={formData.settings.academic.timeZone}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    academic: {
                      ...prev.settings.academic,
                      timeZone: value
                    }
                  }
                }))}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}