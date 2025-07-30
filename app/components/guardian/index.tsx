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
      <div className={`p-6 ${className}`}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Select a Child</h2>
          <MyStudentsSelector
            value={selectedStudentId}
            onChange={handleStudentChange}
            required
            className="max-w-md"
          />
        </div>
        {selectedStudentId && children}
        {!selectedStudentId && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <p className="text-blue-700">Please select a student to view their information</p>
          </div>
        )}
      </div>
    </SelectedStudentContext.Provider>
  );
};

export default ParentDashboard;
