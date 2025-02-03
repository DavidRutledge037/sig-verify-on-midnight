import React, { useState } from 'react';
import { EncryptionService } from '../utils/encryption';
import { ZKProofGenerator } from '../utils/zkProofs';
import { PrivateDocumentManager } from '../contracts/PrivateDocumentManager';
import { DocumentMetadata } from '../types';

interface Props {
    documentManager: PrivateDocumentManager;
    ownerAddress: string;
    privateKey: string;
    onUploadComplete: (documentId: string) => void;
}

export const SecureDocumentUpload: React.FC<Props> = ({
    documentManager,
    ownerAddress,
    privateKey,
    onUploadComplete
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const encryptionService = new EncryptionService();
    const zkProofGenerator = new ZKProofGenerator();

    const handleUpload = async () => {
        if (!file) return;

        try {
            setLoading(true);
            setError(null);

            // 1. Read file
            const content = await file.arrayBuffer();
            const buffer = Buffer.from(content);

            // 2. Generate encryption key
            const encryptionKey = encryptionService.generateKey();

            // 3. Encrypt document
            const encryptedData = await encryptionService.encryptDocument(
                buffer,
                encryptionKey
            );

            // 4. Generate ZK proof
            const zkProof = await zkProofGenerator.generateDocumentProof(
                buffer,
                ownerAddress,
                privateKey
            );

            // 5. Create metadata
            const metadata: DocumentMetadata = {
                title: file.name,
                mimeType: file.type,
                size: file.size,
                tags: ['encrypted']
            };

            // 6. Upload encrypted document
            const documentId = await documentManager.createPrivateDocument(
                ownerAddress,
                encryptedData,
                metadata,
                [ownerAddress],
                zkProof
            );

            onUploadComplete(documentId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="secure-document-upload">
            <input 
                type="file" 
                onChange={e => setFile(e.target.files?.[0] || null)} 
            />
            <button 
                onClick={handleUpload} 
                disabled={!file || loading}
            >
                {loading ? 'Encrypting & Uploading...' : 'Upload Securely'}
            </button>
            {error && <div className="error">{error}</div>}
        </div>
    );
}; 