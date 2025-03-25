import { useState } from "react";
import { useNavigate } from "react-router";
import { StepIndicator } from "./form/StepIndicator";
import { BasicInfoStep } from "./form/BasicInfoStep";
import { GuardianInfoStep } from "./form/GuardianInfoStep";
import { useCreateStudent } from "~/hooks/useStudentQueries";
import type { CreateStudentDto } from "~/types/student";
import { cleanFormData } from "~/utils/cleanFormData";
import toast from 'react-hot-toast';

type FormStep = 'basic' | 'guardian' | 'review';

export function StudentFormPage() {
  const navigate = useNavigate();
  const createStudentMutation = useCreateStudent();
  
  const [activeStep, setActiveStep] = useState<FormStep>('basic');
  const [formData, setFormData] = useState<Partial<CreateStudentDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'guardian', label: 'Guardian Info' },
    { id: 'review', label: 'Review & Submit' }
  ];

  const handleStepComplete = (stepData: Partial<CreateStudentDto>) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);
    
    if (activeStep === 'basic') {
      setActiveStep('guardian');
    } else if (activeStep === 'guardian') {
      setActiveStep('review');
    } else if (activeStep === 'review') {
      handleSubmit(updatedFormData);
    }
  };

  const handleStepSelect = (stepId: FormStep) => {
    const currentIndex = steps.findIndex(s => s.id === activeStep);
    const targetIndex = steps.findIndex(s => s.id === stepId);
    
    if (targetIndex <= currentIndex) {
      setActiveStep(stepId);
    }
  };

  const handleSubmit = async (finalFormData = formData) => {
    try {
      setIsSubmitting(true);
      const cleanedData = cleanFormData(finalFormData) as CreateStudentDto;
      console.log('Submitting data:', cleanedData);
      const result = await createStudentMutation.mutateAsync(cleanedData as CreateStudentDto);
      toast.success('Student record created successfully!');
      navigate(`/dashboard/students/${result.id}/details`);
    } catch (error) {
      console.error('Failed to create student:', error);
      const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while creating the student record';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (activeStep === 'guardian') {
      setActiveStep('basic');
    } else if (activeStep === 'review') {
      setActiveStep('guardian');
    } else {
      navigate('/dashboard/students');
    }
  };

  // Create a ReviewStep component to show all the info before final submission
  const ReviewStep = () => (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-medium">Review Student Information</h3>
      
      {/* Display basic info summary */}
      <div className="border rounded-md p-4">
        <h4 className="font-medium mb-2">Basic Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}</div>
          <div><span className="text-gray-500">CNI:</span> {formData.cniNumber}</div>
          <div><span className="text-gray-500">DOB:</span> {formData.dateOfBirth}</div>
          <div><span className="text-gray-500">Gender:</span> {formData.gender}</div>
          <div><span className="text-gray-500">Grade:</span> {formData.gradeLevel}</div>
          <div><span className="text-gray-500">Admission Date:</span> {formData.admissionDate}</div>
        </div>
      </div>
      
      {/* Display guardian info summary */}
      <div className="border rounded-md p-4">
        <h4 className="font-medium mb-2">Guardian Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="text-gray-500">Name:</span> {formData.guardian?.name}</div>
          <div><span className="text-gray-500">CNI:</span> {formData.guardian?.cniNumber}</div>
          <div><span className="text-gray-500">Relationship:</span> {formData.guardian?.relationship}</div>
          <div><span className="text-gray-500">Phone:</span> {formData.guardian?.phone}</div>
          <div><span className="text-gray-500">Email:</span> {formData.guardian?.email || 'N/A'}</div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Submitting...' : 'Create Student'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Student</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the essential information to create a new student record. 
          Additional details can be added after creation.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator 
          steps={steps} 
          currentStep={activeStep}
          onStepClick={handleStepSelect} 
        />
      </div>

      <div className="bg-white shadow rounded-lg">
        {activeStep === 'basic' && (
          <BasicInfoStep
            data={formData}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        )}
        
        {activeStep === 'guardian' && (
          <GuardianInfoStep
            data={formData}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        )}
        
        {activeStep === 'review' && <ReviewStep />}
      </div>
    </div>
  );
}
