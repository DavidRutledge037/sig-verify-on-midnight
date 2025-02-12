import React from 'react';
import { DropZone } from './DropZone';

export const KYCUpload: React.FC = () => {
    return (
        <div data-testid="kyc-upload" className="space-y-4">
            <h2 className="text-xl font-semibold">KYC Document Upload</h2>
            <DropZone onDrop={() => {}} />
        </div>
    );
}; 