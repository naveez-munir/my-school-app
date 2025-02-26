// components/form/StepIndicator.tsx
import { CheckIcon } from 'lucide-react';

interface StepIndicatorProps {
  steps: Array<{ id: string; label: string }>;
  currentStep: string;
  onStepClick: (step: any) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

          return (
            <li 
              key={step.id} 
              className={`${index !== 0 ? 'ml-8 sm:ml-16' : ''} relative`}
            >
              {index !== 0 && (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`} />
                </div>
              )}
              <button
                onClick={() => onStepClick(step.id)}
                className={`relative flex items-center justify-center ${
                  isCompleted ? 'group' : ''
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="h-9 flex items-center">
                  <span className={`
                    relative z-10 w-8 h-8 flex items-center justify-center rounded-full
                    ${isActive ? 'bg-white border-2 border-blue-600' : ''}
                    ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}
                  `}>
                    {isCompleted ? (
                      <CheckIcon className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`
                        text-sm font-medium
                        ${isActive ? 'text-blue-600' : 'text-gray-500'}
                      `}>
                        {index + 1}
                      </span>
                    )}
                  </span>
                </span>
                <span className="ml-4 min-w-0 flex flex-col">
                  <span className={`
                    text-sm font-medium
                    ${isActive ? 'text-blue-600' : ''}
                    ${isCompleted ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


//TODO convert this section like the we have for teacher
//we need to add the support for class section as well while creating the student or editing
// while creating the student we will allow the user to add minimum info at the start and then latter can add details as well
