import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateTenant } from '~/hooks/useTenantQueries';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { FormActions } from '~/components/common/form/FormActions';
import { TenantStatus, type CreateTenantDto } from '~/types/tenant';

export function meta() {
  return [
    { title: "New Tenant" },
    { name: "description", content: "Create a new tenant" },
  ];
}

export default function NewTenant() {
  const navigate = useNavigate();
  const createTenantMutation = useCreateTenant();

  const [formData, setFormData] = useState<CreateTenantDto>({
    name: '',
    databaseName: '',
    status: TenantStatus.Active,
    maxStudents: 150,
    maxTeachers: 10,
    maxStaff: 5,
    adminEmail: '',
    adminCnic: '',
    adminPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTenantMutation.mutateAsync(formData);
      toast.success('Tenant created successfully!');
      navigate('/admin/tenants');
    } catch (error) {
      toast.error('Failed to create tenant');
    }
  };

  // Auto-generate database name from tenant name
  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      databaseName: value.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_db'
    }));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
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
            Create New Tenant
          </h1>
          <p className="text-sm text-gray-500">
            Add a new tenant to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Tenant Name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="Enter tenant name"
                  disabled={createTenantMutation.isPending}
                />

                <div className="space-y-1">
                  <TextInput
                    label="Database Name"
                    value={formData.databaseName}
                    onChange={(value) => setFormData(prev => ({ ...prev, databaseName: value }))}
                    required
                    placeholder="Database name will be auto-generated"
                    disabled={createTenantMutation.isPending}
                  />
                  <p className="text-xs text-gray-500">
                    Database name will be auto-generated from tenant name
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TenantStatus }))}
                    required
                    disabled={createTenantMutation.isPending}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
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
                  value={formData.maxStudents?.toString() || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, maxStudents: parseInt(value) || 0 }))}
                  required
                  placeholder="150"
                  disabled={createTenantMutation.isPending}
                />

                <TextInput
                  label="Max Teachers"
                  type="number"
                  value={formData.maxTeachers?.toString() || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, maxTeachers: parseInt(value) || 0 }))}
                  required
                  placeholder="10"
                  disabled={createTenantMutation.isPending}
                />

                <TextInput
                  label="Max Staff"
                  type="number"
                  value={formData.maxStaff?.toString() || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, maxStaff: parseInt(value) || 0 }))}
                  required
                  placeholder="5"
                  disabled={createTenantMutation.isPending}
                />
              </div>
            </div>

            {/* Tenant Admin Credentials */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Tenant Admin Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Admin Email"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(value) => setFormData(prev => ({ ...prev, adminEmail: value }))}
                  required
                  placeholder="admin@school.com"
                  disabled={createTenantMutation.isPending}
                />

                <TextInput
                  label="Admin CNIC"
                  value={formData.adminCnic}
                  onChange={(value) => setFormData(prev => ({ ...prev, adminCnic: value }))}
                  required
                  placeholder="12345-1234567-1"
                  disabled={createTenantMutation.isPending}
                />

                <TextInput
                  label="Admin Password"
                  type="password"
                  value={formData.adminPassword}
                  onChange={(value) => setFormData(prev => ({ ...prev, adminPassword: value }))}
                  required
                  placeholder="Enter password"
                  disabled={createTenantMutation.isPending}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/tenants')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTenantMutation.isPending}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createTenantMutation.isPending ? 'Creating...' : 'Create Tenant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}