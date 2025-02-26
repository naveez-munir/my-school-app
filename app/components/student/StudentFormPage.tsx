import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchStudentById, createStudent, updateStudent } from "~/store/features/studentSlice";
import type { CreateStudentDto } from "~/types/student";
import { useNavigate, useParams } from "react-router";
import { GuardianInfoStep } from "./form/GuardianInfoStep";
import { DocumentsStep } from "./form/DocumentsStep";
import { BasicInfoStep } from "./form/BasicInfoStep";
import { AcademicInfoStep } from "./form/AcademicInfoStep";
import { AttendanceRecordsStep } from "./form/AttendanceRecordsStep";

type FormTab = 'basic' | 'guardian' | 'academic' | 'documents';

export function StudentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentStudent, loading } = useAppSelector((state) => state.students);
  
  const [activeTab, setActiveTab] = useState<FormTab>('basic');
  const [formData, setFormData] = useState<Partial<CreateStudentDto>>({});
  const [formProgress, setFormProgress] = useState({
    basic: false,
    guardian: false,
    academic: false,
    documents: false,
    // attendance: true // Always true because it's view-only
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentStudent && id) {
      setFormData(currentStudent);
      // If editing an existing student, consider all steps completed
      setFormProgress({
        basic: true,
        guardian: true,
        academic: true,
        documents: true,
      });
    }
  }, [currentStudent, id]);

  const tabs: Array<{ id: FormTab; label: string; isImplemented: boolean }> = [
    { id: 'basic', label: 'Basic Info', isImplemented: true },
    { id: 'guardian', label: 'Guardian', isImplemented: true },
    { id: 'academic', label: 'Academic', isImplemented: true },
    { id: 'documents', label: 'Documents', isImplemented: true }
  ];

  const handleStepComplete = (stepData: Partial<CreateStudentDto>) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);
    
    // Mark current tab as completed
    setFormProgress(prev => ({
      ...prev,
      [activeTab]: true
    }));
    
    // Navigate to next tab or submit form
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    if (activeTab === 'documents') {
      // If we're on the documents tab, it's the last editable step before submission
      handleSubmit(updatedFormData);
    } else if (currentTabIndex < tabs.length - 1) {
      // Go to next tab
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handleSubmit = async (finalFormData = formData) => {
    try {
      if (id) {
        await dispatch(updateStudent({ id, data: finalFormData }));
      } else {
        await dispatch(createStudent(finalFormData as CreateStudentDto));
      }
      navigate('/dashboard/students');
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  // Function to handle back button in form steps
  const handleBack = (previousTab: FormTab) => {
    setActiveTab(previousTab);
  };

  // Check if a tab should be clickable (only if previous tabs are completed)
  const isTabClickable = (tabId: FormTab) => {
    
    // Basic is always clickable
    if (tabId === 'basic') return true;
    
    // For subsequent tabs, previous ones must be completed
    const tabOrder = ['basic', 'guardian', 'academic', 'documents'];
    const tabIndex = tabOrder.indexOf(tabId);
    
    for (let i = 0; i < tabIndex; i++) {
      if (!formProgress[tabOrder[i] as keyof typeof formProgress]) {
        return false;
      }
    }
    
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? 'Edit Student' : 'Add New Student'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the information below to {id ? 'update' : 'create'} a student record.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => isTabClickable(tab.id) && setActiveTab(tab.id)}
              disabled={!isTabClickable(tab.id)}
              className={`
                py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                ${!isTabClickable(tab.id) && 'opacity-50 cursor-not-allowed'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            {activeTab === 'basic' && (
              <BasicInfoStep
                data={formData}
                onComplete={handleStepComplete}
                onBack={() => navigate('/dashboard/students')}
              />
            )}
            
            {activeTab === 'guardian' && (
              <GuardianInfoStep
                data={formData}
                onComplete={handleStepComplete}
                onBack={() => handleBack('basic')}
              />
            )}
            
            {activeTab === 'academic' && (
              <AcademicInfoStep
                data={formData}
                onComplete={handleStepComplete}
                onBack={() => handleBack('guardian')}
              />
            )}
            
            {activeTab === 'documents' && (
              <DocumentsStep
                data={formData}
                onComplete={handleStepComplete}
                onBack={() => handleBack('academic')}
                isLastStep
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
