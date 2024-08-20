import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router';
import { MyStudentsSelector } from '../common/MyStudentsSelector';

export const SelectedStudentContext = createContext<{
  setSelectedStudentId: (id: string) => void;
}>({
  setSelectedStudentId: () => {}
});

export const useSelectedStudent = () => useContext(SelectedStudentContext);

interface ParentDashboardProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  selectedStudentId: string;
  onStudentChange: (studentId: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  title = 'Parent Dashboard',
  className = '',
  children,
  selectedStudentId,
  onStudentChange
}) => {
  const navigate = useNavigate();

  const handleStudentChange = (studentId: string) => {
    onStudentChange(studentId);
  };

  return (
    <SelectedStudentContext.Provider value={{ setSelectedStudentId: onStudentChange }}>
      < >
       <div className={` ${className}`}>
          <h1 className="text-responsive-xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">{title}</h1>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-responsive-lg font-medium text-gray-700 mb-3 sm:mb-4">Select a Child</h2>
            <MyStudentsSelector
              value={selectedStudentId}
              onChange={handleStudentChange}
              required
              className="max-w-md"
            />
          </div>
          {!selectedStudentId && (
            <div className="bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-blue-200 text-center">
              <p className="text-responsive text-blue-700">Please select a student to view their information</p>
            </div>
          )}
        </div>
        {selectedStudentId && children}
      </>
    </SelectedStudentContext.Provider>
  );
};

export default ParentDashboard;
