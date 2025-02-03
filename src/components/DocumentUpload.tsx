import React, { useState } from 'react';
import { DocumentManager } from '../contracts/DocumentManager';
import { DocumentMetadata } from '../types/document';

interface Props {
    documentManager: DocumentManager;
    onUploadComplete: (documentId: string) => void;
}

export const DocumentUpload: React.FC<Props> = ({ documentManager, onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<Partial<DocumentMetadata>>({
        title: '',
        description: '',
        tags: []
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMetadata(prev => ({
                ...prev,
                mimeType: e.target.files![0].type,
                size: e.target.files![0].size
            }));
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const content = await file.text();
        const docMetadata: DocumentMetadata = {
            title: metadata.title || file.name,
            mimeType: metadata.mimeType || file.type,
            size: metadata.size || file.size,
            description: metadata.description,
            tags: metadata.tags
        };

        const documentId = await documentManager.createDocument(
            'owner_address',
            content,
            docMetadata
        );

        onUploadComplete(documentId);
    };

    return (
        <div className="document-upload">
            <input type="file" onChange={handleFileChange} />
            <input
                type="text"
                placeholder="Title"
                value={metadata.title}
                onChange={e => setMetadata(prev => ({ ...prev, title: e.target.value }))}
            />
            <textarea
                placeholder="Description"
                value={metadata.description}
                onChange={e => setMetadata(prev => ({ ...prev, description: e.target.value }))}
            />
            <button onClick={handleUpload} disabled={!file}>
                Upload Document
            </button>
        </div>
    );
}; 