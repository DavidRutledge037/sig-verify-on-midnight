import React from 'react';

export const BasicInfo: React.FC = () => {
    return (
        <div data-testid="basic-info" className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        data-testid="name-input"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        data-testid="email-input"
                    />
                </div>
            </form>
        </div>
    );
}; 