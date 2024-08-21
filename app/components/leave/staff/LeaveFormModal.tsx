import { useEffect, useState, useMemo } from 'react';
import { Modal } from '~/components/common/Modal';
import {
  type LeaveResponse,
  type CreateLeaveRequest,
  LeaveType,
  EmployeeType
} from '~/types/staffLeave';
import { EmployeeTypeSelector } from '~/components/common/EmployeeTypeSelector';
import { TeacherSelector } from '~/components/common/TeacherSelector';
import { StaffSelector } from '~/components/common/StaffSelector';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TextArea } from '~/components/common/form/inputs/TextArea';
import { isAdmin, getUserRole, getUserId } from '~/utils/auth';

interface LeaveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeaveRequest) => Promise<void>;
  initialData?: LeaveResponse;
  isSubmitting: boolean;
}

export function LeaveFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}: LeaveFormModalProps) {
  const isAdminUser = useMemo(() => isAdmin(), []);
  const currentUserId = useMemo(() => getUserId(), []);
  const currentUserRole = useMemo(() => getUserRole()?.role, []);

  const currentEmployeeType = useMemo(() => {
    if (currentUserRole === 'teacher') return EmployeeType.TEACHER;
    return EmployeeType.STAFF;
  }, [currentUserRole]);

  const [formData, setFormData] = useState<CreateLeaveRequest>({
    employeeId: '',
    employeeType: EmployeeType.TEACHER,
    leaveType: LeaveType.CASUAL,
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        employeeId: initialData.employeeId,
        employeeType: initialData.employeeType,
        leaveType: initialData.leaveType,
        startDate: initialData.startDate.split('T')[0],
        endDate: initialData.endDate.split('T')[0],
        reason: initialData.reason || ''
      });
    } else {
      setFormData({
        employeeId: isAdminUser ? '' : (currentUserId || ''),
        employeeType: isAdminUser ? EmployeeType.TEACHER : currentEmployeeType,
        leaveType: LeaveType.CASUAL,
        startDate: '',
        endDate: '',
        reason: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, isAdminUser, currentUserId, currentEmployeeType]);

  const handleValueChange = (field: keyof CreateLeaveRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee ID is required';
    }
    
    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting leave form', error);
      // Handle API errors if needed
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Leave Request" : "New Leave Request"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {isAdminUser && (
            <div className="grid grid-cols-2 gap-2">
              <EmployeeTypeSelector
               value={formData.employeeType}
               onChange={(value) =>handleValueChange('employeeType', value) }
              />
              {formData?.employeeType && formData.employeeType === EmployeeType.TEACHER ?
                <TeacherSelector
                  value={formData.employeeId}
                  onChange={(employeeId) => setFormData(prev => ({ ...prev, employeeId }))}
                  required
                />
                :
                <StaffSelector
                  value={formData.employeeId}
                  onChange={(employeeId) => setFormData(prev => ({ ...prev, employeeId }))}
                  required
                />
              }
            </div>
          )}

          <SelectInput<typeof LeaveType>
            label="Leave Type"
            value={formData.leaveType}
            options={LeaveType}
            onChange={(value) => handleValueChange('leaveType', value)}
          />
          
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <DateInput
              label="Start Date"
              value={formData.startDate || ''}
              onChange={(value) => handleValueChange("startDate", value)}
            />
            <DateInput 
              label="End Date"
              value={formData.endDate || ''}
              onChange={(value) => handleValueChange('endDate', value)}
            />
          </div>
          
          {/* Reason */}
          <TextArea
           label='Reason for Leave'
           value={formData.reason || ''}
           onChange={(value) => handleValueChange('reason', value)}
           placeholder='Please provide a reason for the leave request'
           rows={3}
          />
        </div>

        <div className="pt-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Submit')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
