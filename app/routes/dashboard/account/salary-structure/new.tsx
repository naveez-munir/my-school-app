import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { type BaseSalaryStructure, type CreateSalaryStructureDto, type Allowance, type Deduction, type PayRate,
  AllowanceType, DeductionType, DayType, EmployeeType, EmployeeCategory,
  AllowanceTypeLabels, DeductionTypeLabels, DayTypeLabels, EmployeeCategoryLabels } from '~/types/salaryStructure';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TeacherSelector } from '~/components/common/TeacherSelector';
import { StaffSelector } from '~/components/common/StaffSelector';
import { useCreateSalaryStructure, useUpdateSalaryStructure, useSalaryStructure } from '~/hooks/useSalaryStructure';

interface NewSalaryStructureProps {
  mode?: 'create' | 'edit';
  structureId?: string;
}

export default function NewSalaryStructure({ mode = 'create', structureId }: NewSalaryStructureProps) {
  const navigate = useNavigate();
  const createMutation = useCreateSalaryStructure();
  const updateMutation = useUpdateSalaryStructure();

  const { data: existingStructure, isLoading } = useSalaryStructure(structureId || '', {
    enabled: !!structureId && mode === 'edit'
  });

  const [formData, setFormData] = useState<CreateSalaryStructureDto>({
    employeeId: '',
    employeeType: EmployeeType.TEACHER,
    employeeCategory: EmployeeCategory.TEACHING,
    basicSalary: 0,
    effectiveFrom: new Date().toISOString().split('T')[0],
    allowances: [],
    deductions: [],
    payRates: []
  });

  const [allowances, setAllowances] = useState<(Allowance & { key: string })[]>([]);
  const [deductions, setDeductions] = useState<(Deduction & { key: string })[]>([]);
  const [payRates, setPayRates] = useState<(PayRate & { key: string })[]>([]);

  useEffect(() => {
    if (existingStructure && mode === 'edit') {
      setFormData({
        employeeId: existingStructure.employeeId || '',
        employeeType: existingStructure.employeeType || EmployeeType.TEACHER,
        employeeCategory: existingStructure.employeeCategory || EmployeeCategory.TEACHING,
        basicSalary: existingStructure.basicSalary || 0,
        effectiveFrom: existingStructure.effectiveFrom ?
          (typeof existingStructure.effectiveFrom === 'string' ? existingStructure.effectiveFrom : existingStructure.effectiveFrom.toISOString().split('T')[0]) :
          new Date().toISOString().split('T')[0],
        effectiveTo: existingStructure.effectiveTo ?
          (typeof existingStructure.effectiveTo === 'string' ? existingStructure.effectiveTo : existingStructure.effectiveTo.toISOString().split('T')[0]) :
          undefined,
        maxOvertimeHours: existingStructure.maxOvertimeHours,
        sickLeaveAllowance: existingStructure.sickLeaveAllowance,
        casualLeaveAllowance: existingStructure.casualLeaveAllowance,
        earnedLeaveAllowance: existingStructure.earnedLeaveAllowance
      });

      setAllowances((existingStructure.allowances || []).map(item => ({
        ...item,
        key: Math.random().toString(36).substr(2, 9)
      })));

      setDeductions((existingStructure.deductions || []).map(item => ({
        ...item,
        key: Math.random().toString(36).substr(2, 9)
      })));

      setPayRates((existingStructure.payRates || []).map(item => ({
        ...item,
        key: Math.random().toString(36).substr(2, 9)
      })));
    }
  }, [existingStructure, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      allowances: allowances.map(({ key, ...rest }) => rest),
      deductions: deductions.map(({ key, ...rest }) => rest),
      payRates: payRates.map(({ key, ...rest }) => rest)
    };

    try {
      if (mode === 'edit' && structureId) {
        await updateMutation.mutateAsync({ id: structureId, data: dataToSubmit });
        toast.success('Salary structure updated successfully');
      } else {
        await createMutation.mutateAsync(dataToSubmit);
        toast.success('Salary structure created successfully');
      }
      navigate('/dashboard/accounts/salary-structure');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} salary structure`);
    }
  };

  const handleAddAllowance = () => {
    const newAllowance = {
      allowanceType: AllowanceType.HRA,
      amount: 0,
      isFixed: true,
      percentage: 0,
      description: '',
      key: Math.random().toString(36).substr(2, 9)
    };

    setAllowances([...allowances, newAllowance]);
  };

  const handleRemoveAllowance = (index: number) => {
    const updatedAllowances = [...allowances];
    updatedAllowances.splice(index, 1);
    setAllowances(updatedAllowances);
  };

  const updateAllowance = (index: number, field: keyof Allowance, value: any) => {
    const updatedAllowances = [...allowances];
    updatedAllowances[index] = {
      ...updatedAllowances[index],
      [field]: value
    };
    setAllowances(updatedAllowances);
  };

  const handleAddDeduction = () => {
    const newDeduction = {
      deductionType: DeductionType.TAX,
      amount: 0,
      isFixed: true,
      percentage: 0,
      description: '',
      key: Math.random().toString(36).substr(2, 9)
    };

    setDeductions([...deductions, newDeduction]);
  };

  const handleRemoveDeduction = (index: number) => {
    const updatedDeductions = [...deductions];
    updatedDeductions.splice(index, 1);
    setDeductions(updatedDeductions);
  };

  const updateDeduction = (index: number, field: keyof Deduction, value: any) => {
    const updatedDeductions = [...deductions];
    updatedDeductions[index] = {
      ...updatedDeductions[index],
      [field]: value
    };
    setDeductions(updatedDeductions);
  };

  const handleAddPayRate = () => {
    const newPayRate = {
      dayType: DayType.FULL_DAY,
      rate: 0,
      key: Math.random().toString(36).substr(2, 9)
    };

    setPayRates([...payRates, newPayRate]);
  };

  const handleRemovePayRate = (index: number) => {
    const updatedPayRates = [...payRates];
    updatedPayRates.splice(index, 1);
    setPayRates(updatedPayRates);
  };

  const updatePayRate = (index: number, field: keyof PayRate, value: any) => {
    const updatedPayRates = [...payRates];
    updatedPayRates[index] = {
      ...updatedPayRates[index],
      [field]: value
    };
    setPayRates(updatedPayRates);
  };

  const employeeTypeOptions = {
    [EmployeeType.TEACHER]: 'Teacher',
    [EmployeeType.STAFF]: 'Staff'
  };

  const employeeCategoryOptions = {
    [EmployeeCategory.TEACHING]: 'Teaching',
    [EmployeeCategory.ADMINISTRATIVE]: 'Administrative',
    [EmployeeCategory.SUPPORT]: 'Support',
    [EmployeeCategory.MAINTENANCE]: 'Maintenance'
  };

  const allowanceTypeOptions = Object.entries(AllowanceTypeLabels).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );

  const deductionTypeOptions = Object.entries(DeductionTypeLabels).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );

  const dayTypeOptions = Object.entries(DayTypeLabels).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );

  const pageTitle = mode === 'edit' ? 'Edit Salary Structure' : 'Add New Salary Structure';
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
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
          onClick={() => navigate('/dashboard/accounts/salary-structure')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Salary Structures
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.employeeType === EmployeeType.TEACHER ?
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
            <SelectInput
              label="Employee Type"
              value={formData.employeeType}
              options={employeeTypeOptions}
              onChange={(value) => setFormData(prev => ({ ...prev, employeeType: value as EmployeeType }))}
              disabled={isSubmitting}
            />

            <SelectInput
              label="Employee Category"
              value={formData.employeeCategory}
              options={employeeCategoryOptions}
              onChange={(value) => setFormData(prev => ({ ...prev, employeeCategory: value as EmployeeCategory }))}
              disabled={isSubmitting}
            />

            <TextInput
              label="Basic Salary"
              value={formData.basicSalary.toString()}
              onChange={(value) => setFormData(prev => ({ ...prev, basicSalary: Number(value) }))}
              type="number"
              required
              disabled={isSubmitting}
            />

            <DateInput
              label="Effective From"
              value={formData.effectiveFrom as string}
              onChange={(value) => setFormData(prev => ({ ...prev, effectiveFrom: value }))}
              required
              disabled={isSubmitting}
            />

            <DateInput
             label='Effective To (Optional)'
             value={formData.effectiveTo as string}
             onChange={(value) => setFormData(prev => ({ ...prev, effectiveTo: value }))}
             disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Leave & Overtime Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              label="Max Overtime Hours"
              value={formData.maxOvertimeHours?.toString() || '0'}
              onChange={(value) => setFormData(prev => ({ ...prev, maxOvertimeHours: Number(value) }))}
              type="number"
              disabled={isSubmitting}
            />

            <TextInput
              label="Sick Leave Allowance"
              value={formData.sickLeaveAllowance?.toString() || '12'}
              onChange={(value) => setFormData(prev => ({ ...prev, sickLeaveAllowance: Number(value) }))}
              type="number"
              disabled={isSubmitting}
            />

            <TextInput
              label="Casual Leave Allowance"
              value={formData.casualLeaveAllowance?.toString() || '12'}
              onChange={(value) => setFormData(prev => ({ ...prev, casualLeaveAllowance: Number(value) }))}
              type="number"
              disabled={isSubmitting}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <SelectInput<typeof AllowanceType>
                  label="Allowance Type"
                  value={allowance.allowanceType}
                  options={AllowanceType}
                  onChange={(value) => updateAllowance(index, 'allowanceType', value as AllowanceType)}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id={`isFixed-${index}`}
                    checked={allowance.isFixed}
                    onChange={(e) => updateAllowance(index, 'isFixed', e.target.checked)}
                    disabled={isSubmitting}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`isFixed-${index}`} className="ml-2 block text-sm text-gray-700">
                    Fixed Amount (uncheck for percentage based)
                  </label>
                </div>

                {!allowance.isFixed && (
                  <TextInput
                    label="Percentage (%)"
                    value={allowance.percentage?.toString() || '0'}
                    onChange={(value) => updateAllowance(index, 'percentage', Number(value))}
                    type="number"
                    disabled={isSubmitting}
                  />
                )}
              </div>

              <div className="mt-2">
                <TextInput
                  label="Description (Optional)"
                  value={allowance.description || ''}
                  onChange={(value) => updateAllowance(index, 'description', value)}
                  disabled={isSubmitting}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <SelectInput<typeof DeductionType>
                  label="Deduction Type"
                  value={deduction.deductionType}
                  options={DeductionType}
                  onChange={(value) => updateDeduction(index, 'deductionType', value as DeductionType)}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id={`deduction-isFixed-${index}`}
                    checked={deduction.isFixed}
                    onChange={(e) => updateDeduction(index, 'isFixed', e.target.checked)}
                    disabled={isSubmitting}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`deduction-isFixed-${index}`} className="ml-2 block text-sm text-gray-700">
                    Fixed Amount (uncheck for percentage based)
                  </label>
                </div>

                {!deduction.isFixed && (
                  <TextInput
                    label="Percentage (%)"
                    value={deduction.percentage?.toString() || '0'}
                    onChange={(value) => updateDeduction(index, 'percentage', Number(value))}
                    type="number"
                    disabled={isSubmitting}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <TextInput
                  label="Start Date (Optional)"
                  value={deduction.startDate ?
                    (typeof deduction.startDate === 'string' ? deduction.startDate : deduction.startDate.toISOString().split('T')[0]) : ''}
                  onChange={(value) => updateDeduction(index, 'startDate', value)}
                  type="date"
                  disabled={isSubmitting}
                />

                <TextInput
                  label="End Date (Optional)"
                  value={deduction.endDate ?
                    (typeof deduction.endDate === 'string' ? deduction.endDate : deduction.endDate.toISOString().split('T')[0]) : ''}
                  onChange={(value) => updateDeduction(index, 'endDate', value)}
                  type="date"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mt-2">
                <TextInput
                  label="Description (Optional)"
                  value={deduction.description || ''}
                  onChange={(value) => updateDeduction(index, 'description', value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium">Pay Rates</h4>
            <button
              type="button"
              onClick={handleAddPayRate}
              className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Pay Rate
            </button>
          </div>

          {payRates.length === 0 && (
            <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
              No pay rates added. Click "Add Pay Rate" to begin.
            </div>
          )}

          {payRates.map((payRate, index) => (
            <div
              key={payRate.key}
              className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium">Pay Rate #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => handleRemovePayRate(index)}
                  className="text-red-600 hover:text-red-800"
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput<typeof DayTypeLabels>
                  label="Day Type"
                  value={payRate.dayType as string}
                  options={DayTypeLabels}
                  onChange={(value) => updatePayRate(index, 'dayType', value as DayType)}
                  required
                  disabled={isSubmitting}
                />

                <TextInput
                  label="Rate"
                  value={payRate.rate.toString()}
                  onChange={(value) => updatePayRate(index, 'rate', Number(value))}
                  type="number"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/accounts/salary-structure')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (mode === 'edit' ? 'Updating...' : 'Creating...')
              : (mode === 'edit' ? 'Update Salary Structure' : 'Create Salary Structure')}
          </button>
        </div>
      </form>
    </div>
  );
}
