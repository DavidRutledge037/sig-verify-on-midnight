import React from 'react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
    currentStep, 
    totalSteps = 3 
}) => {
    return (
        <div data-testid="step-indicator" className="flex justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div 
                    key={i} 
                    data-testid={`step-${i + 1}`}
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${i + 1 <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    {i + 1}
                </div>
            ))}
        </div>
    );
}; 