import React, { useState, useEffect } from 'react';
import { Document } from '../types';

interface Props {
    documentId: string;
    onClose: () => void;
}

export const DocumentPreview: React.FC<Props> = ({ documentId, onClose }) => {
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDocument();
    }, [documentId]);

    const loadDocument = async () => {
        try {
            setLoading(true);
            // Load document from IPFS or other storage
            // Decrypt if necessary
            setDocument(/* loaded document */);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="document-preview">
            <div className="preview-header">
                <h3>Document Preview</h3>
                <button onClick={onClose}>Close</button>
            </div>
            {loading ? (
                <div className="loading">Loading document...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : document ? (
                <div className="preview-content">
                    <div className="metadata">
                        <p>Title: {document.metadata.title}</p>
                        <p>Type: {document.metadata.mimeType}</p>
                        <p>Size: {document.metadata.size} bytes</p>
                    </div>
                    <div className="content">
                        {/* Render document content based on type */}
                    </div>
                </div>
            ) : null}
        </div>
    );
}; 