import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { TeacherSelector } from '~/components/common/TeacherSelector';
import { StaffSelector } from '~/components/common/StaffSelector';
import { EmployeeTypeSelector } from '~/components/common/EmployeeTypeSelector';
import { MonthSelector } from '~/components/common/MonthSelector';
import { YearSelector } from '~/components/common/YearSelector';
import { SalaryStatusSelector } from '~/components/common/SalaryStatusSelector';
import { useSalaryStructuresByEmployee } from '~/hooks/useSalaryStructure';
import { useCreateSalary, useSalary, useUpdateSalary } from '~/hooks/useSalaryQueries';
import {
  EmployeeType,
  SalaryStatus,
  AttendanceType,
  AttendanceTypeLabels,
  AllowanceType,
  AllowanceTypeLabels,
  DeductionType,
  DeductionTypeLabels,
  type CreateSalaryDto,
  type SalaryAllowance,
  type SalaryDeduction,
  type AttendanceBreakdown
} from '~/types/salary.types';

interface NewSalaryProps {
  mode?: 'create' | 'edit' | 'view';
  salaryId?: string;
}

export default function NewSalary({ mode = 'create', salaryId }: NewSalaryProps) {
  const navigate = useNavigate();
  const createSalaryMutation = useCreateSalary();
  const updateSalaryMutation = useUpdateSalary();

  const { data: existingSalary, isLoading: isLoadingSalary } = useSalary(salaryId || '', {
    enabled: !!salaryId && (mode === 'edit' || mode === 'view')
  });

  const [formData, setFormData] = useState<CreateSalaryDto>({
    employeeId: '',
    employeeType: EmployeeType.TEACHER,
    salaryStructureId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const [allowances, setAllowances] = useState<(SalaryAllowance & { key: string })[]>([]);
  const [deductions, setDeductions] = useState<(SalaryDeduction & { key: string })[]>([]);
  const [attendance, setAttendance] = useState<(AttendanceBreakdown & { key: string })[]>([]);

  const { data: salaryStructures } = useSalaryStructuresByEmployee(
    formData.employeeId,
    formData.employeeType as EmployeeType
  );

  const activeStructure = salaryStructures?.find(s => s.isActive);

  useEffect(() => {
    if (existingSalary && (mode === 'edit' || mode === 'view')) {
      setFormData({
        employeeId: existingSalary.employeeId || '',
        employeeType: existingSalary.employeeType,
        salaryStructureId: existingSalary.salaryStructureId || '',
        month: existingSalary.month,
        year: existingSalary.year,
        workingDays: existingSalary.workingDays,
        presentDays: existingSalary.presentDays,
        leaveDays: existingSalary.leaveDays,
        overtimeHours: existingSalary.overtimeHours,
        status: existingSalary.status
      });

      if (existingSalary.allowances) {
        setAllowances(existingSalary.allowances.map(item => ({
          ...item,
          key: Math.random().toString(36).substring(2, 11)
        })));
      }

      if (existingSalary.deductions) {
        setDeductions(existingSalary.deductions.map(item => ({
          ...item,
          key: Math.random().toString(36).substring(2, 11)
        })));
      }

      if (existingSalary.attendanceBreakdown) {
        setAttendance(existingSalary.attendanceBreakdown.map(item => ({
          ...item,
          key: Math.random().toString(36).substring(2, 11)
        })));
      }
    }
  }, [existingSalary, mode]);

  useEffect(() => {
    if (activeStructure && formData.employeeId) {
      if (activeStructure.allowances && activeStructure.allowances.length > 0) {
        const populatedAllowances = activeStructure.allowances.map((allowance) => ({
          allowanceType: allowance.allowanceType,
          amount: allowance.amount,
          calculatedAmount: allowance.amount,
          remarks: allowance.description || '',
          key: Math.random().toString(36).substring(2, 11)
        }));
        setAllowances(populatedAllowances);
      }

      if (activeStructure.deductions && activeStructure.deductions.length > 0) {
        const populatedDeductions = activeStructure.deductions.map((deduction) => ({
          deductionType: deduction.deductionType,
          amount: deduction.amount,
          calculatedAmount: deduction.amount,
          remarks: deduction.description || '',
          key: Math.random().toString(36).substring(2, 11)
        }));
        setDeductions(populatedDeductions);
      }

      if (activeStructure.id) {
        setFormData(prev => ({ ...prev, salaryStructureId: activeStructure.id! }));
      }
    }
  }, [activeStructure, formData.employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      allowances: allowances.map(({ key, ...rest }) => rest),
      deductions: deductions.map(({ key, ...rest }) => rest),
      attendanceBreakdown: attendance.map(({ key, ...rest }) => rest)
    };

    try {
      if (mode === 'edit' && salaryId) {
        await updateSalaryMutation.mutateAsync({ id: salaryId, data: dataToSubmit });
        toast.success('Salary updated successfully');
      } else {
        await createSalaryMutation.mutateAsync(dataToSubmit);
        toast.success('Salary created successfully');
      }
      navigate('/dashboard/accounts/salary');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} salary`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  const handleAddAllowance = () => {
    setAllowances([...allowances, {
      allowanceType: AllowanceType.HRA,
      amount: 0,
      calculatedAmount: 0,
      remarks: '',
      key: Math.random().toString(36).substring(2, 11)
    }]);
  };

  const handleRemoveAllowance = (index: number) => {
    const updated = [...allowances];
    updated.splice(index, 1);
    setAllowances(updated);
  };

  const updateAllowance = (index: number, field: keyof SalaryAllowance, value: any) => {
    const updated = [...allowances];
    updated[index] = { ...updated[index], [field]: value };
    setAllowances(updated);
  };

  const handleAddDeduction = () => {
    setDeductions([...deductions, {
      deductionType: DeductionType.TAX,
      amount: 0,
      calculatedAmount: 0,
      remarks: '',
      key: Math.random().toString(36).substring(2, 11)
    }]);
  };

  const handleRemoveDeduction = (index: number) => {
    const updated = [...deductions];
    updated.splice(index, 1);
    setDeductions(updated);
  };

  const updateDeduction = (index: number, field: keyof SalaryDeduction, value: any) => {
    const updated = [...deductions];
    updated[index] = { ...updated[index], [field]: value };
    setDeductions(updated);
  };

  const handleAddAttendance = () => {
    setAttendance([...attendance, {
      date: new Date().toISOString().split('T')[0],
      type: AttendanceType.FULL_DAY,
      hours: 8,
      amount: 0,
      remarks: '',
      key: Math.random().toString(36).substring(2, 11)
    }]);
  };

  const handleRemoveAttendance = (index: number) => {
    const updated = [...attendance];
    updated.splice(index, 1);
    setAttendance(updated);
  };

  const updateAttendance = (index: number, field: keyof AttendanceBreakdown, value: any) => {
    const updated = [...attendance];
    updated[index] = { ...updated[index], [field]: value };
    setAttendance(updated);
  };

  const attendanceTypeOptions: Record<string, string> = {};
  Object.entries(AttendanceTypeLabels).forEach(([key, value]) => {
    attendanceTypeOptions[key] = value;
  });

  const allowanceTypeOptions: Record<string, string> = {};
  Object.entries(AllowanceTypeLabels).forEach(([key, value]) => {
    allowanceTypeOptions[key] = value;
  });

  const deductionTypeOptions: Record<string, string> = {};
  Object.entries(DeductionTypeLabels).forEach(([key, value]) => {
    deductionTypeOptions[key] = value;
  });

  const totalAllowances = allowances.reduce((sum, item) => sum + (item.calculatedAmount || 0), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + (item.calculatedAmount || 0), 0);
  const overtimeAmount = attendance
    .filter(entry => entry.type === AttendanceType.OVERTIME)
    .reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const basicSalary = activeStructure?.basicSalary || 0;
  const grossSalary = basicSalary + totalAllowances + overtimeAmount;
  const netSalary = grossSalary - totalDeductions;

  const isReadOnly = mode === 'view';
  const pageTitle = mode === 'edit' ? 'Edit Salary' : mode === 'view' ? 'View Salary' : 'Create New Salary';

  if (isLoadingSalary) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/accounts/salary')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Salaries
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.employeeType === EmployeeType.TEACHER ? (
              <TeacherSelector
                value={formData.employeeId}
                onChange={(employeeId) => setFormData(prev => ({ ...prev, employeeId }))}
                required
              />
            ) : (
              <StaffSelector
                value={formData.employeeId}
                onChange={(employeeId) => setFormData(prev => ({ ...prev, employeeId }))}
                required
              />
            )}

            <EmployeeTypeSelector
              value={formData.employeeType}
              onChange={(value) => setFormData(prev => ({ ...prev, employeeType: value as EmployeeType }))}
              includeAll={false}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Salary Period</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MonthSelector
              value={formData.month}
              onChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
              required
            />

            <YearSelector
              value={formData.year}
              onChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
              range={{
                start: new Date().getFullYear() - 2,
                end: new Date().getFullYear() + 2
              }}
              required
            />

            <TextInput
              label="Working Days"
              value={formData.workingDays?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, workingDays: Number(value) }))}
              type="number"
            />

            <TextInput
              label="Present Days"
              value={formData.presentDays?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, presentDays: Number(value) }))}
              type="number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <TextInput
              label="Leave Days"
              value={formData.leaveDays?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, leaveDays: Number(value) }))}
              type="number"
            />

            <TextInput
              label="Overtime Hours"
              value={formData.overtimeHours?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, overtimeHours: Number(value) }))}
              type="number"
            />

            <SalaryStatusSelector
              value={formData.status || SalaryStatus.PENDING}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value as SalaryStatus }))}
              includeAll={false}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium">Allowances</h4>
            <button
              type="button"
              onClick={handleAddAllowance}
              className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={createSalaryMutation.isPending}
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
                  disabled={createSalaryMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectInput
                  label="Allowance Type"
                  value={allowance.allowanceType}
                  options={allowanceTypeOptions}
                  onChange={(value) => updateAllowance(index, 'allowanceType', value as AllowanceType)}
                  required
                  disabled={createSalaryMutation.isPending}
                />

                <TextInput
                  label="Amount"
                  value={allowance.amount?.toString() || '0'}
                  onChange={(value) => updateAllowance(index, 'amount', Number(value))}
                  type="number"
                  required
                  disabled={createSalaryMutation.isPending}
                />

                <TextInput
                  label="Calculated Amount"
                  value={allowance.calculatedAmount?.toString() || '0'}
                  onChange={(value) => updateAllowance(index, 'calculatedAmount', Number(value))}
                  type="number"
                  required
                  disabled={createSalaryMutation.isPending}
                />

                <TextInput
                  label="Remarks"
                  value={allowance.remarks || ''}
                  onChange={(value) => updateAllowance(index, 'remarks', value)}
                  disabled={createSalaryMutation.isPending}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium">Deductions</h4>
            <button
              type="button"
              onClick={handleAddDeduction}
              className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={createSalaryMutation.isPending}
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
                  disabled={createSalaryMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectInput
                  label="Deduction Type"
                  value={deduction.deductionType}
                  options={deductionTypeOptions}
                  onChange={(value) => updateDeduction(index, 'deductionType', value as DeductionType)}
                  required
                  disabled={createSalaryMutation.isPending}
                />

                <TextInput
                  label="Amount"
                  value={deduction.amount?.toString() || '0'}
                  onChange={(value) => updateDeduction(index, 'amount', Number(value))}
                  type="number"
                  required
                  disabled={createSalaryMutation.isPending}
                />

                <TextInput
                  label="Calculated Amount"
                  value={deduction.calculatedAmount?.toString() || '0'}
                  onChange={(value) => updateDeduction(index, 'calculatedAmount', Number(value))}
                  type="number"
                  required
                  disabled={createSalaryMutation.isPending}
                />

                <TextInput
                  label="Remarks"
                  value={deduction.remarks || ''}
                  onChange={(value) => updateDeduction(index, 'remarks', value)}
                  disabled={createSalaryMutation.isPending}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium">Attendance Breakdown</h4>
            <button
              type="button"
              onClick={handleAddAttendance}
              className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={createSalaryMutation.isPending}
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
                  disabled={createSalaryMutation.isPending}
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
                  disabled={createSalaryMutation.isPending}
                />

                <SelectInput
                  label="Type"
                  value={entry.type}
                  options={attendanceTypeOptions}
                  onChange={(value) => updateAttendance(index, 'type', value as AttendanceType)}
                  required
                  disabled={createSalaryMutation.isPending}
                />

                <TextInput
                  label="Hours"
                  value={entry.hours?.toString() || '0'}
                  onChange={(value) => updateAttendance(index, 'hours', Number(value))}
                  type="number"
                  disabled={createSalaryMutation.isPending || entry.type !== AttendanceType.OVERTIME}
                />

                <TextInput
                  label="Amount"
                  value={entry.amount?.toString() || '0'}
                  onChange={(value) => updateAttendance(index, 'amount', Number(value))}
                  type="number"
                  required
                  disabled={createSalaryMutation.isPending}
                />

                <TextInput
                  label="Remarks"
                  value={entry.remarks || ''}
                  onChange={(value) => updateAttendance(index, 'remarks', value)}
                  disabled={createSalaryMutation.isPending}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold mb-4">Salary Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <p className="text-sm text-gray-600">Basic Salary</p>
              <p className="text-lg font-semibold">Rs. {basicSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Allowances</p>
              <p className="text-lg font-semibold text-green-600">+ Rs. {totalAllowances.toLocaleString()}</p>
            </div>
            {overtimeAmount > 0 && (
              <div>
                <p className="text-sm text-gray-600">Overtime</p>
                <p className="text-lg font-semibold text-green-600">+ Rs. {overtimeAmount.toLocaleString()}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Gross Salary</p>
              <p className="text-lg font-semibold">Rs. {grossSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Deductions</p>
              <p className="text-lg font-semibold text-red-600">- Rs. {totalDeductions.toLocaleString()}</p>
            </div>
            <div className="border-l-2 border-blue-300 pl-4">
              <p className="text-sm text-gray-600">Net Salary</p>
              <p className="text-xl font-bold text-blue-700">Rs. {netSalary.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/accounts/salary')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={createSalaryMutation.isPending || updateSalaryMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={createSalaryMutation.isPending || updateSalaryMutation.isPending}
            >
              {createSalaryMutation.isPending || updateSalaryMutation.isPending
                ? (mode === 'edit' ? 'Updating...' : 'Creating...')
                : (mode === 'edit' ? 'Update Salary' : 'Create Salary')}
            </button>
          </div>
        )}
        {isReadOnly && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard/accounts/salary')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
