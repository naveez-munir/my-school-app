import { CheckIcon } from "lucide-react";
import type { StepIndicatorProps } from "~/types/student";

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted =
            steps.findIndex((s) => s.id === currentStep) > index;

          return (
            <li
              key={step.id}
              className={`relative flex items-center ${
                index !== steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <button
                onClick={() => onStepClick(step.id)}
                className={`relative flex items-center justify-center ${
                  isCompleted ? "group" : ""
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="h-7 lg:h-9 flex items-center">
                  <span
                    className={`
                    relative z-10 w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-full
                    ${isActive ? "bg-white border-2 border-blue-600" : ""}
                    ${isCompleted ? "bg-blue-600" : "bg-gray-200"}
                  `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    ) : (
                      <span
                        className={`
                        text-xs lg:text-sm font-medium
                        ${isActive ? "text-blue-600" : "text-gray-500"}
                      `}
                      >
                        {index + 1}
                      </span>
                    )}
                  </span>
                </span>
                <span className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex flex-col">
                  <span
                    className={`
                    text-xs lg:text-sm font-medium whitespace-nowrap
                    ${isActive ? "text-blue-600" : ""}
                    ${isCompleted ? "text-gray-900" : "text-gray-500"}
                  `}
                  >
                    {step.label}
                  </span>
                </span>
              </button>

              {/* Connecting line between steps */}
              {index !== steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 sm:mx-3 lg:mx-4"
                  aria-hidden="true"
                >
                  <div
                    className={`h-full ${
                      isCompleted ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
