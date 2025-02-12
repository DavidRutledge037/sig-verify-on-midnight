import React from 'react';

interface DropZoneProps {
    onDrop: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        onDrop(files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div
            data-testid="dropzone"
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <p>Drag and drop files here</p>
        </div>
    );
}; 