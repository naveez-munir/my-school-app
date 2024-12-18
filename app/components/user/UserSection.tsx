import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useUserList,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserStatus,
  useUpdatePassword,
  useUser,
} from '~/hooks/useUserQueries';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { PasswordModal } from './PasswordModal';
import { UserSkeleton } from './UserSkeleton';
import DeletePrompt from '../common/DeletePrompt';
import { getErrorMessage } from '~/utils/error';
import { isAdmin } from '~/utils/auth';
import type { User, CreateUserDto, UpdateUserDto, UpdatePasswordDto } from '~/types/user';

export const UserSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<User | null>(null);
  const [deletePrompt, setDeletePrompt] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({
    isOpen: false,
    userId: null,
  });

  const { data: users = [], isLoading, error } = useUserList();
  const { data: userDetail } = useUser(selectedUserId || '');
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();
  const updatePasswordMutation = useUpdatePassword();

  const canManageUsers = isAdmin();

  const handleCreate = async (data: CreateUserDto | UpdateUserDto) => {
    try {
      await createUserMutation.mutateAsync(data as CreateUserDto);
      setIsModalOpen(false);
      toast.success('User created successfully');
    } catch (err: any) {
      toast.error(getErrorMessage(err));
      console.error('Error creating user:', err);
    }
  };

  const handleUpdate = async (data: CreateUserDto | UpdateUserDto) => {
    if (selectedUserId) {
      try {
        await updateUserMutation.mutateAsync({
          id: selectedUserId,
          data: data as UpdateUserDto,
        });
        setIsModalOpen(false);
        setSelectedUserId(null);
        toast.success('User updated successfully');
      } catch (err: any) {
        toast.error(getErrorMessage(err));
        console.error('Error updating user:', err);
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUserId(user._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletePrompt({
      isOpen: true,
      userId: id,
    });
  };

  const confirmDelete = async () => {
    if (deletePrompt.userId) {
      try {
        await deleteUserMutation.mutateAsync(deletePrompt.userId);
        closeDeletePrompt();
        toast.success('User deleted successfully');
      } catch (err: any) {
        toast.error(getErrorMessage(err));
        console.error('Error deleting user:', err);
      }
    }
  };

  const closeDeletePrompt = () => {
    setDeletePrompt({
      isOpen: false,
      userId: null,
    });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatusMutation.mutateAsync(id);
      toast.success('User status updated successfully');
    } catch (err: any) {
      toast.error(getErrorMessage(err));
      console.error('Error toggling user status:', err);
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUserForPassword(user);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordUpdate = async (data: UpdatePasswordDto) => {
    if (selectedUserForPassword) {
      try {
        await updatePasswordMutation.mutateAsync({
          id: selectedUserForPassword._id,
          data,
        });
        setIsPasswordModalOpen(false);
        setSelectedUserForPassword(null);
        toast.success('Password updated successfully');
      } catch (err: any) {
        toast.error(getErrorMessage(err));
        console.error('Error updating password:', err);
      }
    }
  };

  if (!canManageUsers) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Access Restricted
        </h3>
        <p className="text-yellow-700">
          You do not have permission to access user management. This feature is only
          available to Administrators and Principals.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">
          User Management
        </h2>
        <button
          onClick={() => {
            setSelectedUserId(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New User
        </button>
      </div>

      {isLoading ? (
        <UserSkeleton />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{(error as Error).message}</p>
        </div>
      ) : (
        <UserTable
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onResetPassword={handleResetPassword}
        />
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUserId(null);
        }}
        onSubmit={(data) => {
          if (selectedUserId) {
            handleUpdate(data);
          } else {
            handleCreate(data);
          }
        }}
        initialData={userDetail}
        isSubmitting={createUserMutation.isPending || updateUserMutation.isPending}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setSelectedUserForPassword(null);
        }}
        onSubmit={handlePasswordUpdate}
        user={selectedUserForPassword}
        isSubmitting={updatePasswordMutation.isPending}
      />

      <DeletePrompt
        isOpen={deletePrompt.isOpen}
        onClose={closeDeletePrompt}
        onConfirm={confirmDelete}
        itemName="user"
      />
    </div>
  );
};
