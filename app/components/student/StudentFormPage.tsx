import { useEffect, useState } from "react";
import type { CreateStudentDto } from "~/types/student";
import { useNavigate, useParams } from "react-router";
import { GuardianInfoStep } from "./form/GuardianInfoStep";
import { DocumentsStep } from "./form/DocumentsStep";
import { BasicInfoStep } from "./form/BasicInfoStep";
import { AcademicInfoStep } from "./form/AcademicInfoStep";
import { useStudent, useCreateStudent, useUpdateStudent } from "~/hooks/useStudentQueries";

type FormTab = 'basic' | 'guardian' | 'academic' | 'documents';

export function StudentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // React Query hooks
  const { data: currentStudent, isLoading: loading } = useStudent(id || '');
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  
  const [activeTab, setActiveTab] = useState<FormTab>('basic');
  const [formData, setFormData] = useState<Partial<CreateStudentDto>>({});

  useEffect(() => {
    if (currentStudent && id) {
      setFormData(currentStudent);
    }
  }, [currentStudent, id]);

  const tabs: Array<{ id: FormTab; label: string }> = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'guardian', label: 'Guardian' },
    { id: 'academic', label: 'Academic' },
    { id: 'documents', label: 'Documents' }
  ];

  const handleStepComplete = (stepData: Partial<CreateStudentDto>) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);
    
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
        await updateStudentMutation.mutateAsync({ id, data: finalFormData });
      } else {
        await createStudentMutation.mutateAsync(finalFormData as CreateStudentDto);
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
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
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
