import { useState } from "react";
import { useNavigate } from "react-router";
import { StepIndicator } from "./form/StepIndicator";
import { BasicInfoStep } from "./form/BasicInfoStep";
import { GuardianInfoStep } from "./form/GuardianInfoStep";
import { useCreateStudent } from "~/hooks/useStudentQueries";
import type { CreateStudentDto } from "~/types/student";
import { cleanFormData } from "~/utils/cleanFormData";
import toast from 'react-hot-toast';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { getErrorMessage } from '~/utils/error';

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
      console.log('Backend response:', result);

      if (!result) {
        throw new Error('No response received from server');
      }

      if (!result.id) {
        console.error('Response missing ID field:', result);
        throw new Error('Student created but no ID returned from server');
      }

      toast.success('Student record created successfully!', { duration: 5000 });
      navigate(`/dashboard/students/${result.id}`);
    } catch (error) {
      console.error('Failed to create student:', error);
      toast.error(getErrorMessage(error), { duration: 5000 });
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
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
      <h3 className="text-page-title">Review Student Information</h3>

      {/* Display basic info summary */}
      <div className="border rounded-md p-3 sm:p-4">
        <h4 className="text-heading mb-2 sm:mb-3">Basic Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="text-body"><span className="text-label">Name:</span> {formData.firstName} {formData.lastName}</div>
          <div className="text-body"><span className="text-label">CNI:</span> {formData.cniNumber}</div>
          <div className="text-body"><span className="text-label">DOB:</span> {formatUserFriendlyDate(formData.dateOfBirth)}</div>
          <div className="text-body"><span className="text-label">Gender:</span> {formData.gender}</div>
          <div className="text-body"><span className="text-label">Grade:</span> {formData.gradeLevel}</div>
          <div className="text-body"><span className="text-label">Admission Date:</span> {formatUserFriendlyDate(formData.admissionDate)}</div>
        </div>
      </div>

      {/* Display guardian info summary */}
      <div className="border rounded-md p-3 sm:p-4">
        <h4 className="text-heading mb-2 sm:mb-3">Guardian Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="text-body"><span className="text-label">Name:</span> {formData.guardian?.name}</div>
          <div className="text-body"><span className="text-label">CNI:</span> {formData.guardian?.cniNumber}</div>
          <div className="text-body"><span className="text-label">Relationship:</span> {formData.guardian?.relationship}</div>
          <div className="text-body"><span className="text-label">Phone:</span> {formData.guardian?.phone}</div>
          <div className="text-body"><span className="text-label">Email:</span> {formData.guardian?.email || 'N/A'}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-5 lg:pt-6 border-t">
        <button
          type="button"
          onClick={handleBack}
          className="btn-secondary"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
          className="btn-primary disabled:bg-blue-400"
        >
          {isSubmitting ? 'Submitting...' : 'Create Student'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-responsive-xl font-semibold text-gray-900">Add New Student</h1>
        <p className="mt-1 sm:mt-2 text-body-secondary">
          Enter the essential information to create a new student record.
          Additional details can be added after creation.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
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
