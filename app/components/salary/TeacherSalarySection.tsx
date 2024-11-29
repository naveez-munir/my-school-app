import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTeacherProfile } from '~/hooks/useTeacherQueries';
import { useEmployeeSalaries } from '~/hooks/useSalaryQueries';
import { SalariesTable } from '~/components/account/salary/SalariesTable';
import { SalariesSkeleton } from '~/components/account/salary/SalariesSkeleton';
import { YearSelector } from '~/components/common/YearSelector';
import { ViewSalaryModal } from '~/components/account/salary/ViewSalaryModal';
import type { SalaryResponse } from '~/types/salary.types';

export function TeacherSalarySection() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedSalary, setSelectedSalary] = useState<SalaryResponse | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: teacher, isLoading: isLoadingProfile, error: profileError } = useTeacherProfile();

  const { data: salaries = [], isLoading: isLoadingSalaries, error } = useEmployeeSalaries(
    teacher?._id || '',
    'Teacher',
    year
  );

  const handleView = (salary: SalaryResponse) => {
    setSelectedSalary(salary);
    setIsViewModalOpen(true);
  };

  const handleGenerateSlip = (id: string) => {
    const salary = salaries.find(s => s.id === id);
    if (salary) {
      setSelectedSalary(salary);
      setIsViewModalOpen(true);
    } else {
      toast.error('Salary not found');
    }
  };

  if (isLoadingProfile) {
    return <SalariesSkeleton />;
  }

  if (!teacher) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Unable to load teacher profile
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-responsive-xl font-bold text-gray-900">My Salary History</h1>
          <p className="mt-1 text-xs lg:text-sm text-gray-500">
            View your salary details and download salary slips
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="w-64">
          <YearSelector
            value={year}
            onChange={setYear}
            range={{
              start: new Date().getFullYear() - 5,
              end: new Date().getFullYear()
            }}
          />
        </div>
      </div>

      {isLoadingSalaries ? (
        <SalariesSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {(error as Error).message}
        </div>
      ) : (
        <SalariesTable
          data={salaries}
          onView={handleView}
          onGenerateSlip={handleGenerateSlip}
          readOnly={true}
        />
      )}

      {selectedSalary && (
        <ViewSalaryModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedSalary(null);
          }}
          salary={selectedSalary}
        />
      )}
    </div>
  );
}

