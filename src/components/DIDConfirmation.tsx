import React from 'react';

export const DIDConfirmation: React.FC = () => {
    return (
        <div data-testid="did-confirmation" className="space-y-4">
            <h2 className="text-xl font-semibold">DID Confirmation</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                    Your Decentralized Identity (DID) has been created.
                </p>
            </div>
        </div>
    );
}; 