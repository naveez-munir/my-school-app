import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { FormActions } from '~/components/common/form/FormActions';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TeacherSelector } from '~/components/common/TeacherSelector';
import { StaffSelector } from '~/components/common/StaffSelector';
import { 
  EmployeeType, 
  SalaryStatus,
  PaymentMethod,
  PaymentMethodLabels,
  type SalaryAllowance,
  type SalaryDeduction,
  type AttendanceBreakdown,
  AttendanceType,
  AttendanceTypeLabels,
  type CreateSalaryDto,
  type UpdateSalaryDto
} from '~/types/salary.types';
import { EmployeeTypeSelector } from '~/components/common/EmployeeTypeSelector';
import { MonthSelector } from '~/components/common/MonthSelector';
import { YearSelector } from '~/components/common/YearSelector';
import { SalaryStatusSelector } from '~/components/common/SalaryStatusSelector';

interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSalaryDto & Partial<UpdateSalaryDto>) => void;
  initialData?: Partial<CreateSalaryDto & Partial<UpdateSalaryDto>>;
  isSubmitting?: boolean;
  mode: 'create' | 'edit' | 'approve' | 'payment';
}

export function SalaryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  isSubmitting = false,
  mode = 'create'
}: SalaryModalProps) {
  const [formData, setFormData] = useState<CreateSalaryDto & Partial<UpdateSalaryDto>>({
    employeeId: '',
    employeeType: EmployeeType.TEACHER,
    salaryStructureId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    // Add defaults for payment/approval fields
    paymentMethod: PaymentMethod.CASH,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentReference: '',
    approvedBy: ''
  });

  const [allowances, setAllowances] = useState<(SalaryAllowance & { key: string })[]>([]);
  const [deductions, setDeductions] = useState<(SalaryDeduction & { key: string })[]>([]);
  const [attendance, setAttendance] = useState<(AttendanceBreakdown & { key: string })[]>([]);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        employeeId: initialData.employeeId || '',
        employeeType: initialData.employeeType || EmployeeType.TEACHER,
        salaryStructureId: initialData.salaryStructureId || '',
        month: initialData.month || new Date().getMonth() + 1,
        year: initialData.year || new Date().getFullYear(),
        workingDays: initialData.workingDays,
        presentDays: initialData.presentDays,
        leaveDays: initialData.leaveDays,
        overtimeHours: initialData.overtimeHours,
        status: initialData.status,
        paymentMethod: initialData.paymentMethod || PaymentMethod.CASH,
        paymentDate: initialData.paymentDate || new Date().toISOString().split('T')[0],
        paymentReference: initialData.paymentReference || '',
        approvedBy: initialData.approvedBy || '',
        remarks: initialData.remarks
      });

      setAllowances((initialData.allowances || []).map(item => ({
        ...item,
        calculatedAmount: item.amount,
        key: Math.random().toString(36).substring(2, 11)
      })));
      
      setDeductions((initialData.deductions || []).map(item => ({
        ...item,
        calculatedAmount: item.amount,
        key: Math.random().toString(36).substring(2, 11)
      })));

      setAttendance((initialData.attendanceBreakdown || []).map(item => ({
        ...item,
        key: Math.random().toString(36).substring(2, 11)
      })));
    } else {
      setFormData({
        employeeId: '',
        employeeType: EmployeeType.TEACHER,
        salaryStructureId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        paymentMethod: PaymentMethod.CASH,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentReference: '',
        approvedBy: ''
      });
      setAllowances([]);
      setDeductions([]);
      setAttendance([]);
    }
  }, [initialData, isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove the key property when submitting
    const dataToSubmit = {
      ...formData,
      allowances: allowances.map(({ key, ...rest }) => rest),
      deductions: deductions.map(({ key, ...rest }) => rest),
      attendanceBreakdown: attendance.map(({ key, ...rest }) => rest)
    };
    onSubmit(dataToSubmit);
  };

  // Allowance handlers
  const handleAddAllowance = () => {
    const newAllowance = {
      allowanceType: 'HRA',
      amount: 0,
      calculatedAmount: 0,
      remarks: '',
      key: Math.random().toString(36).substring(2, 11)
    };
    
    setAllowances([...allowances, newAllowance]);
  };

  const handleRemoveAllowance = (index: number) => {
    const updatedAllowances = [...allowances];
    updatedAllowances.splice(index, 1);
    setAllowances(updatedAllowances);
  };

  const updateAllowance = (index: number, field: keyof SalaryAllowance, value: any) => {
    const updatedAllowances = [...allowances];
    updatedAllowances[index] = {
      ...updatedAllowances[index],
      [field]: value
    };
    setAllowances(updatedAllowances);
  };

  // Deduction handlers
  const handleAddDeduction = () => {
    const newDeduction = {
      deductionType: 'TAX',
      amount: 0,
      calculatedAmount: 0,
      remarks: '',
      key: Math.random().toString(36).substring(2, 11)
    };
    
    setDeductions([...deductions, newDeduction]);
  };

  const handleRemoveDeduction = (index: number) => {
    const updatedDeductions = [...deductions];
    updatedDeductions.splice(index, 1);
    setDeductions(updatedDeductions);
  };

  const updateDeduction = (index: number, field: keyof SalaryDeduction, value: any) => {
    const updatedDeductions = [...deductions];
    updatedDeductions[index] = {
      ...updatedDeductions[index],
      [field]: value
    };
    setDeductions(updatedDeductions);
  };

  // Attendance handlers
  const handleAddAttendance = () => {
    const newAttendance = {
      date: new Date().toISOString().split('T')[0],
      type: AttendanceType.FULL_DAY,
      hours: 8,
      amount: 0,
      remarks: '',
      key: Math.random().toString(36).substring(2, 11)
    };
    
    setAttendance([...attendance, newAttendance]);
  };

  const handleRemoveAttendance = (index: number) => {
    const updatedAttendance = [...attendance];
    updatedAttendance.splice(index, 1);
    setAttendance(updatedAttendance);
  };

  const updateAttendance = (index: number, field: keyof AttendanceBreakdown, value: any) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = {
      ...updatedAttendance[index],
      [field]: value
    };
    setAttendance(updatedAttendance);
  };

  const paymentMethodOptions: Record<string, string> = {};
  Object.entries(PaymentMethodLabels).forEach(([key, value]) => {
    paymentMethodOptions[key] = value;
  });

  const attendanceTypeOptions: Record<string, string> = {};
  Object.entries(AttendanceTypeLabels).forEach(([key, value]) => {
    attendanceTypeOptions[key] = value;
  });

  // Modal title based on mode
  const modalTitle = {
    'create': 'Add New Salary',
    'edit': 'Edit Salary',
    'approve': 'Approve Salary',
    'payment': 'Process Payment'
  }[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">{modalTitle}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {formData.employeeType === EmployeeType.TEACHER ?
              <TeacherSelector
                value={formData.employeeId}
                onChange={(employeeId) => setFormData(prev => ({ ...prev, employeeId }))}
                required
                disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
              />
              :
              <StaffSelector
                value={formData.employeeId}
                onChange={(employeeId) => setFormData(prev => ({ ...prev, employeeId }))}
                required
                disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
              />
            }
            
            <EmployeeTypeSelector
              value={formData.employeeType}
              onChange={(value) => setFormData(prev => ({ ...prev, employeeType: value as EmployeeType }))}
              disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
              includeAll={false}
            />
            
            <TextInput
              label="Salary Structure ID"
              value={formData.salaryStructureId || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, salaryStructureId: value }))}
              required
              disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <MonthSelector
              value={formData.month}
              onChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
              required
              disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
            />
            
            <YearSelector
              value={formData.year}
              onChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
              range={{
                start: new Date().getFullYear() - 2,
                end: new Date().getFullYear() + 2
              }}
              required
              disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
            />
            
            <TextInput
              label="Working Days"
              value={formData.workingDays?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, workingDays: Number(value) }))}
              type="number"
              disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
            />
            
            <TextInput
              label="Present Days"
              value={formData.presentDays?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, presentDays: Number(value) }))}
              type="number"
              disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Leave Days"
              value={formData.leaveDays?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, leaveDays: Number(value) }))}
              type="number"
              disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
            />
            
            <TextInput
              label="Overtime Hours"
              value={formData.overtimeHours?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, overtimeHours: Number(value) }))}
              type="number"
              disabled={isSubmitting || mode === 'approve' || mode === 'payment'}
            />
            
            <SalaryStatusSelector
              value={formData.status || SalaryStatus.PENDING}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value as SalaryStatus }))}
              disabled={isSubmitting || (mode !== 'edit' && mode !== 'approve')}
              includeAll={false}
            />
          </div>

          {/* Payment section (only for payment mode) */}
          {mode === 'payment' && (
            <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200">
              <h4 className="text-md font-medium mb-4">Payment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="Payment Method"
                  value={formData.paymentMethod || PaymentMethod.CASH}
                  options={paymentMethodOptions}
                  onChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}
                  required
                  disabled={isSubmitting}
                />
                
                <DateInput
                  label="Payment Date"
                  value={formData.paymentDate as string || new Date().toISOString().split('T')[0]}
                  onChange={(value) => setFormData(prev => ({ ...prev, paymentDate: value }))}
                  required
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Payment Reference"
                  value={formData.paymentReference || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, paymentReference: value }))}
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Remarks"
                  value={formData.remarks || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, remarks: value }))}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Approval section (only for approve mode) */}
          {mode === 'approve' && (
            <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-200">
              <h4 className="text-md font-medium mb-4">Approval Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Approved By"
                  value={formData.approvedBy || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, approvedBy: value }))}
                  required
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Comments"
                  value={formData.remarks || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, remarks: value }))}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Only show allowances, deductions for create/edit mode */}
          {(mode === 'create' || mode === 'edit') && (
            <>
              {/* Allowances Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Allowances</h4>
                  <button
                    type="button"
                    onClick={handleAddAllowance}
                    className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Allowance
                  </button>
                </div>

                {allowances.length === 0 && (
                  <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                    No allowances added. Click "Add Allowance" to begin.
                  </div>
                )}

                {allowances.map((allowance, index) => (
                  <div 
                    key={allowance.key} 
                    className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Allowance #{index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllowance(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TextInput
                        label="Allowance Type"
                        value={allowance.allowanceType}
                        onChange={(value) => updateAllowance(index, 'allowanceType', value)}
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Amount"
                        value={allowance.amount.toString()}
                        onChange={(value) => updateAllowance(index, 'amount', Number(value))}
                        type="number"
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Calculated Amount"
                        value={allowance.calculatedAmount.toString()}
                        onChange={(value) => updateAllowance(index, 'calculatedAmount', Number(value))}
                        type="number"
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Remarks"
                        value={allowance.remarks || ''}
                        onChange={(value) => updateAllowance(index, 'remarks', value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Deductions Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Deductions</h4>
                  <button
                    type="button"
                    onClick={handleAddDeduction}
                    className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Deduction
                  </button>
                </div>

                {deductions.length === 0 && (
                  <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                    No deductions added. Click "Add Deduction" to begin.
                  </div>
                )}

                {deductions.map((deduction, index) => (
                  <div 
                    key={deduction.key} 
                    className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Deduction #{index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeduction(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TextInput
                        label="Deduction Type"
                        value={deduction.deductionType}
                        onChange={(value) => updateDeduction(index, 'deductionType', value)}
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Amount"
                        value={deduction.amount.toString()}
                        onChange={(value) => updateDeduction(index, 'amount', Number(value))}
                        type="number"
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Calculated Amount"
                        value={deduction.calculatedAmount.toString()}
                        onChange={(value) => updateDeduction(index, 'calculatedAmount', Number(value))}
                        type="number"
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Remarks"
                        value={deduction.remarks || ''}
                        onChange={(value) => updateDeduction(index, 'remarks', value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance Breakdown */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Attendance Breakdown</h4>
                  <button
                    type="button"
                    onClick={handleAddAttendance}
                    className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Attendance Entry
                  </button>
                </div>

                {attendance.length === 0 && (
                  <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
                    No attendance entries added. Click "Add Attendance Entry" to begin.
                  </div>
                )}

                {attendance.map((entry, index) => (
                  <div 
                    key={entry.key} 
                    className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Attendance Entry #{index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendance(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DateInput
                        label="Date"
                        value={typeof entry.date === 'string' ? entry.date : entry.date.toISOString().split('T')[0]}
                        onChange={(value) => updateAttendance(index, 'date', value)}
                        required
                        disabled={isSubmitting}
                      />
                      
                      <SelectInput
                        label="Type"
                        value={entry.type}
                        options={attendanceTypeOptions}
                        onChange={(value) => updateAttendance(index, 'type', value as AttendanceType)}
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Hours"
                        value={entry.hours?.toString() || '0'}
                        onChange={(value) => updateAttendance(index, 'hours', Number(value))}
                        type="number"
                        disabled={isSubmitting || entry.type !== AttendanceType.OVERTIME}
                      />
                      
                      <TextInput
                        label="Amount"
                        value={entry.amount.toString()}
                        onChange={(value) => updateAttendance(index, 'amount', Number(value))}
                        type="number"
                        required
                        disabled={isSubmitting}
                      />
                      
                      <TextInput
                        label="Remarks"
                        value={entry.remarks || ''}
                        onChange={(value) => updateAttendance(index, 'remarks', value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-6">
            <FormActions
              mode={mode as 'edit' | 'create'}
              entityName="Salary"
              onCancel={onClose}
              isLoading={isSubmitting}
              onSubmit={undefined}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
