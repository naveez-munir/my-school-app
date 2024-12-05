import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import { TextInput } from '../common/form/inputs/TextInput';
import { FormActions } from '../common/form/FormActions';
import { useCreateTenant, useUpdateTenant } from '~/hooks/useTenantQueries';
import type { Tenant, CreateTenantDto } from '~/types/tenant';
import { TenantStatus } from '~/types/tenant';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: Tenant | null;
}

export function TenantModal({ isOpen, onClose, tenant }: TenantModalProps) {
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

  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();

  const isEditing = !!tenant;
  const isSubmitting = createTenantMutation.isPending || updateTenantMutation.isPending;

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        databaseName: tenant.databaseName,
        status: tenant.status,
        maxStudents: tenant.maxStudents,
        maxTeachers: tenant.maxTeachers,
        maxStaff: tenant.maxStaff,
        adminEmail: '',
        adminCnic: '',
        adminPassword: '',
      });
    } else {
      setFormData({
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
    }
  }, [tenant, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && tenant) {
        await updateTenantMutation.mutateAsync({
          id: tenant._id,
          data: formData
        });
        toast.success('Tenant updated successfully!');
      } else {
        await createTenantMutation.mutateAsync(formData);
        toast.success('Tenant created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update tenant' : 'Failed to create tenant');
    }
  };

  // Auto-generate database name from tenant name
  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      // Only auto-generate database name for new tenants
      databaseName: !isEditing ? value.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_db' : prev.databaseName
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Tenant' : 'Create New Tenant'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <TextInput
            label="Tenant Name"
            value={formData.name}
            onChange={handleNameChange}
            required
            placeholder="Enter tenant name"
            disabled={isSubmitting}
          />

          <div className="space-y-1">
            <TextInput
              label="Database Name"
              value={formData.databaseName}
              onChange={(value) => setFormData(prev => ({ ...prev, databaseName: value }))}
              required
              placeholder="Enter database name"
              disabled={isSubmitting || isEditing} // Don't allow editing database name
            />
            {!isEditing && (
              <p className="text-xs text-gray-500">Database name will be auto-generated from tenant name</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TenantStatus }))}
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
            >
              <option value={TenantStatus.Active}>Active</option>
              <option value={TenantStatus.Inactive}>Inactive</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <TextInput
              label="Max Students"
              type="number"
              value={formData.maxStudents?.toString() || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, maxStudents: parseInt(value) || 0 }))}
              required
              placeholder="150"
              disabled={isSubmitting}
            />

            <TextInput
              label="Max Teachers"
              type="number"
              value={formData.maxTeachers?.toString() || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, maxTeachers: parseInt(value) || 0 }))}
              required
              placeholder="10"
              disabled={isSubmitting}
            />

            <TextInput
              label="Max Staff"
              type="number"
              value={formData.maxStaff?.toString() || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, maxStaff: parseInt(value) || 0 }))}
              required
              placeholder="5"
              disabled={isSubmitting}
            />
          </div>

          {!isEditing && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Tenant Admin Credentials
              </h3>

              <div className="space-y-4">
                <TextInput
                  label="Admin Email"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(value) => setFormData(prev => ({ ...prev, adminEmail: value }))}
                  required
                  placeholder="admin@school.com"
                  disabled={isSubmitting}
                />

                <TextInput
                  label="Admin CNIC"
                  value={formData.adminCnic}
                  onChange={(value) => setFormData(prev => ({ ...prev, adminCnic: value }))}
                  required
                  placeholder="12345-1234567-1"
                  disabled={isSubmitting}
                />

                <TextInput
                  label="Admin Password"
                  type="password"
                  value={formData.adminPassword}
                  onChange={(value) => setFormData(prev => ({ ...prev, adminPassword: value }))}
                  required
                  placeholder="Enter password"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <FormActions
            mode={isEditing ? 'edit' : 'create'}
            entityName="Tenant"
            onCancel={onClose}
            isLoading={isSubmitting}
            onSubmit={undefined}
          />
        </div>
      </form>
    </Modal>
  );
}