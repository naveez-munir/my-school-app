import { useEffect, useState } from 'react';
import { type BaseSalaryStructure, type CreateSalaryStructureDto, type Allowance, type Deduction, type PayRate, 
  AllowanceType, DeductionType, DayType, EmployeeType, EmployeeCategory,
  AllowanceTypeLabels, DeductionTypeLabels, DayTypeLabels, EmployeeCategoryLabels } from '~/types/salaryStructure';
import { Plus, Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { FormActions } from '~/components/common/form/FormActions';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { TeacherSelector } from '~/components/common/TeacherSelector';
import { StaffSelector } from '~/components/common/StaffSelector';

interface SalaryStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSalaryStructureDto) => void;
  initialData?: Partial<BaseSalaryStructure>;
  isSubmitting?: boolean;
}

export function SalaryStructureModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  isSubmitting = false 
}: SalaryStructureModalProps) {
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
    if (initialData) {
      setFormData({
        employeeId: initialData.employeeId || '',
        employeeType: initialData.employeeType || EmployeeType.TEACHER,
        employeeCategory: initialData.employeeCategory || EmployeeCategory.TEACHING,
        basicSalary: initialData.basicSalary || 0,
        effectiveFrom: initialData.effectiveFrom ? 
          (typeof initialData.effectiveFrom === 'string' ? initialData.effectiveFrom : initialData.effectiveFrom.toISOString().split('T')[0]) : 
          new Date().toISOString().split('T')[0],
        effectiveTo: initialData.effectiveTo ? 
          (typeof initialData.effectiveTo === 'string' ? initialData.effectiveTo : initialData.effectiveTo.toISOString().split('T')[0]) : 
          undefined,
        maxOvertimeHours: initialData.maxOvertimeHours,
        sickLeaveAllowance: initialData.sickLeaveAllowance,
        casualLeaveAllowance: initialData.casualLeaveAllowance,
        earnedLeaveAllowance: initialData.earnedLeaveAllowance
      });

      setAllowances((initialData.allowances || []).map(item => ({
        ...item,
        key: Math.random().toString(36).substr(2, 9)
      })));

      setDeductions((initialData.deductions || []).map(item => ({
        ...item,
        key: Math.random().toString(36).substr(2, 9)
      })));

      setPayRates((initialData.payRates || []).map(item => ({
        ...item,
        key: Math.random().toString(36).substr(2, 9)
      })));
    } else {
      setFormData({
        employeeId: '',
        employeeType: EmployeeType.TEACHER,
        employeeCategory: EmployeeCategory.TEACHING,
        basicSalary: 0,
        effectiveFrom: new Date().toISOString().split('T')[0],
        allowances: [],
        deductions: [],
        payRates: []
      });
      setAllowances([]);
      setDeductions([]);
      setPayRates([]);
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
      payRates: payRates.map(({ key, ...rest }) => rest)
    };
    onSubmit(dataToSubmit);
  };

  // Allowance handlers
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

  // Deduction handlers
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

  // Pay rate handlers
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          {initialData?.id ? 'Edit Salary Structure' : 'Add New Salary Structure'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

          {/* Allowances Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Allowances</h4>
              <button
                type="button"
                onClick={handleAddAllowance}
                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
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

          {/* Deductions Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Deductions</h4>
              <button
                type="button"
                onClick={handleAddDeduction}
                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
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

          {/* Pay Rates Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Pay Rates</h4>
              <button
                type="button"
                onClick={handleAddPayRate}
                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
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

          <div className="mt-6">
            <FormActions
              mode={initialData?.id ? 'edit' : 'create'}
              entityName="Salary Structure"
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
