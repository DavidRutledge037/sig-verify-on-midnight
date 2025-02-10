import React from 'react';

interface DocumentPreviewProps {
    files: File[];
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ files }) => {
    if (files.length === 0) return null;

    return (
        <div data-testid="document-preview" className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
            <ul className="space-y-2">
                {files.map((file, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <span>{file.name}</span>
                        <span className="text-sm text-gray-500">({file.type})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}; 