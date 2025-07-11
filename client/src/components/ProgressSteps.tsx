import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8 sm:mb-10">
      {/* Mobile Progress */}
      <div className="block lg:hidden mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-bold text-gray-600">
            Langkah {currentStep + 1} dari {steps.length}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 font-semibold">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 shadow-inner">
          <div
            className={`bg-gradient-to-r ${steps[currentStep].color} h-2 sm:h-3 rounded-full transition-all duration-500 shadow-lg`}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="text-center mt-3 sm:mt-4">
          <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r ${steps[currentStep].color} text-white rounded-2xl shadow-lg`}>
            {React.createElement(steps[currentStep].icon, { size: 16 })}
            <span className="font-bold text-sm sm:text-base">{steps[currentStep].title}</span>
          </div>
        </div>
      </div>

      {/* Desktop Steps */}
      <div className="hidden lg:flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={index} className="flex-1 relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-full w-full h-1 -ml-8 z-0">
                  <div className={`h-full transition-all duration-500 rounded-full ${
                    isCompleted 
                      ? `bg-gradient-to-r ${steps[index + 1].color}` 
                      : 'bg-gray-200'
                  }`} />
                </div>
              )}
              
              {/* Step Circle */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg
                  ${isActive 
                    ? `bg-gradient-to-r ${step.color} text-white shadow-xl transform scale-110` 
                    : isCompleted 
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-400 border-2 border-gray-200'
                  }
                `}>
                  {isCompleted ? (
                    <Check size={24} />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                
                <p className={`mt-3 text-sm font-bold text-center max-w-24 transition-colors duration-300 ${
                  isActive 
                    ? 'text-gray-900' 
                    : isCompleted 
                    ? 'text-emerald-600' 
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;