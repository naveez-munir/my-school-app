import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { getAllowedRoles } from '~/utils/auth';
import { EntitySelector } from './EntitySelector';
import { TextInput } from '../common/form/inputs/TextInput';
import type { User, CreateUserDto, UpdateUserDto, UserRoleEnum } from '~/types/user';
import { roleLabels } from '~/types/user';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void;
  initialData?: User | null;
  isSubmitting: boolean;
}

interface CreateFormData {
  entityId: string;
  email: string;
  password: string;
  role: UserRoleEnum | '';
}

interface EditFormData {
  name: string;
  email: string;
  role: UserRoleEnum;
}

export const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: UserModalProps) => {
  const isEditMode = !!initialData;
  const allowedRoles = getAllowedRoles();

  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    entityId: '',
    email: '',
    password: '',
    role: allowedRoles[0] || '',
  });

  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    email: '',
    role: allowedRoles[0] || 'teacher' as UserRoleEnum,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form data when modal opens/closes or initialData changes
  useEffect(() => {
    if (initialData) {
      setEditFormData({
        name: initialData.name,
        email: initialData.email || '',
        role: initialData.role,
      });
    } else {
      setCreateFormData({
        entityId: '',
        email: '',
        password: '',
        role: allowedRoles[0] || '',
      });
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const handleClose = () => {
    setCreateFormData({
      entityId: '',
      email: '',
      password: '',
      role: allowedRoles[0] || '',
    });
    setEditFormData({
      name: '',
      email: '',
      role: allowedRoles[0] || 'teacher' as UserRoleEnum,
    });
    setErrors({});
    onClose();
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (isEditMode) {
      if (!editFormData.name || editFormData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (editFormData.email && !validateEmail(editFormData.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (!editFormData.role) {
        newErrors.role = 'Role is required';
      }
    } else {
      if (!createFormData.role) {
        newErrors.role = 'Role is required';
      }

      if (!createFormData.entityId) {
        newErrors.entityId = 'Please select an entity';
      }

      if (!createFormData.password) {
        newErrors.password = 'Password is required';
      } else if (createFormData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (createFormData.email && !validateEmail(createFormData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode) {
      const updateData: UpdateUserDto = {
        name: editFormData.name,
        email: editFormData.email || undefined,
        role: editFormData.role,
      };
      onSubmit(updateData);
    } else {
      const createData: CreateUserDto = {
        entityId: createFormData.entityId,
        email: createFormData.email || undefined,
        password: createFormData.password,
        role: createFormData.role as UserRoleEnum,
      };
      onSubmit(createData);
    }
  };



  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit User' : 'Create New User'}
      size="lg"
      closeOnOutsideClick={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role *
          </label>
          <select
            value={isEditMode ? editFormData.role : createFormData.role}
            onChange={(e) => {
              const newRole = e.target.value as UserRoleEnum;
              if (isEditMode) {
                setEditFormData({ ...editFormData, role: newRole });
              } else {
                setCreateFormData({ ...createFormData, role: newRole, entityId: '' });
              }
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isSubmitting}
            required
          >
            {allowedRoles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role] || role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {isEditMode && (
          <TextInput
            label="Name"
            value={editFormData.name}
            onChange={(value) => setEditFormData({ ...editFormData, name: value })}
            required
            disabled={isSubmitting}
            error={errors.name}
            placeholder="Enter name"
          />
        )}

        {/* Create Mode: Entity Selector */}
        {!isEditMode && createFormData.role && (
          <div>
            <EntitySelector
              key={createFormData.role}
              role={createFormData.role}
              value={createFormData.entityId}
              onChange={(entityId) => setCreateFormData({ ...createFormData, entityId })}
              required
            />
            {errors.entityId && (
              <p className="mt-1 text-sm text-red-600">{errors.entityId}</p>
            )}
          </div>
        )}

        <TextInput
          label="Email"
          value={isEditMode ? editFormData.email : createFormData.email}
          onChange={(value) => {
            if (isEditMode) {
              setEditFormData({ ...editFormData, email: value });
            } else {
              setCreateFormData({ ...createFormData, email: value });
            }
          }}
          type="email"
          disabled={isSubmitting}
          error={errors.email}
          placeholder="Enter email (optional)"
        />

        {!isEditMode && (
          <TextInput
            label="Password"
            value={createFormData.password}
            onChange={(value) => setCreateFormData({ ...createFormData, password: value })}
            type="password"
            required
            disabled={isSubmitting}
            error={errors.password}
            placeholder="Minimum 8 characters"
          />
        )}


        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
              ? 'Update User'
              : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
