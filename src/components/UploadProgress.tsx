import React from 'react';

interface UploadProgressProps {
    files: File[];
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ files }) => {
    if (files.length === 0) return null;

    return (
        <div data-testid="upload-progress" className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full w-0"></div>
            </div>
        </div>
    );
}; 