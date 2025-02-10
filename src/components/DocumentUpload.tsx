import React, { useState } from 'react';
import { DropZone } from './DropZone';
import { DocumentPreview } from './DocumentPreview';
import { UploadProgress } from './UploadProgress';

export const DocumentUpload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    
    const handleDrop = (droppedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    return (
        <div className="p-4 border rounded-lg">
            <DropZone onDrop={handleDrop} />
            {files.length > 0 && (
                <>
                    <DocumentPreview files={files} />
                    <UploadProgress files={files} />
                </>
            )}
        </div>
    );
};

export default DocumentUpload; 