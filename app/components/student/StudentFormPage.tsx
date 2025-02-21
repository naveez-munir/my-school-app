// pages/StudentFormPage.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchStudentById, createStudent, updateStudent } from "~/store/features/studentSlice";
import type { Student, CreateStudentDto } from "~/types/student";
import { useNavigate, useParams } from "react-router";
import { StepIndicator } from "./form/StepIndicator";
import { BasicInfoStep } from "./form/BasicInfoStep";
import { GuardianInfoStep } from "./form/GuardianInfoStep";
import { DocumentsStep } from "./form/DocumentsStep";

type FormStep = 'basic' | 'guardian' | 'documents';

export function StudentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentStudent, loading } = useAppSelector((state) => state.students);
  
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [formData, setFormData] = useState<Partial<CreateStudentDto>>({});

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentStudent && id) {
      setFormData(currentStudent);
    }
  }, [currentStudent, id]);

  const steps: { id: FormStep; label: string }[] = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'guardian', label: 'Guardian Details' },
    { id: 'documents', label: 'Documents & Photo' },
  ];

  const handleStepComplete = (stepData: Partial<CreateStudentDto>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await dispatch(updateStudent({ id, data: formData }));
      } else {
        await dispatch(createStudent(formData as CreateStudentDto));
      }
      navigate('/dashboard/students');
    } catch (error) {
      console.error('Failed to save student:', error);
    }
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

      <StepIndicator
        steps={steps} 
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <div className="mt-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            {currentStep === 'basic' && id && currentStudent && (
              <BasicInfoStep
                data={formData}
                onComplete={handleStepComplete}
                onBack={() => navigate('/dashboard/students')}
              />
            )}
            
            {currentStep === 'guardian' && id && currentStudent && (
              <GuardianInfoStep
                data={formData}
                onComplete={handleStepComplete}
                onBack={() => setCurrentStep('basic')}
              />
            )}
            
            {currentStep === 'documents' && (
              <DocumentsStep
                data={formData}
                onComplete={handleStepComplete}
                onBack={() => setCurrentStep('guardian')}
                isLastStep
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
