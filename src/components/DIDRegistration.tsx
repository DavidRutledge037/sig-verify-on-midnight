import React, { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { BasicInfo } from './BasicInfo';
import { KYCUpload } from './KYCUpload';
import { DIDConfirmation } from './DIDConfirmation';

export const DIDRegistration: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="flex flex-col space-y-4">
            <StepIndicator currentStep={currentStep} />
            
            {currentStep === 1 && <BasicInfo />}
            {currentStep === 2 && <KYCUpload />}
            {currentStep === 3 && <DIDConfirmation />}

            <div className="flex justify-between mt-4">
                {currentStep > 1 && (
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-200 rounded"
                        data-testid="back-button"
                    >
                        Back
                    </button>
                )}
                {currentStep < 3 && (
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        data-testid="next-button"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default DIDRegistration; 