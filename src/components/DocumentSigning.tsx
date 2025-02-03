import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { LoadingSpinner } from './LoadingSpinner';

export const DocumentSigning: React.FC = () => {
    const { address } = useWallet();
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSign = async () => {
        if (!file || !address) return;

        try {
            setIsLoading(true);
            setError(null);

            // TODO: Implement actual file signing logic
            const fileHash = await calculateFileHash(file);
            // Mock signature for now
            setSignature('0x123...abc');
        } catch (err) {
            setError('Failed to sign document');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateFileHash = async (file: File): Promise<string> => {
        // TODO: Implement actual file hashing
        return 'mockHash123';
    };

    return (
        <div className="document-signing">
            <h2>Sign Document</h2>
            
            <div className="upload-section">
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="file-input"
                />
                {file && <p className="file-name">Selected: {file.name}</p>}
            </div>

            <button
                onClick={handleSign}
                disabled={!file || isLoading}
                className="sign-button"
            >
                {isLoading ? <LoadingSpinner /> : 'Sign Document'}
            </button>

            {error && <div className="error-message">{error}</div>}
            
            {signature && (
                <div className="signature-result">
                    <h3>Document Signed!</h3>
                    <p>Signature: {signature}</p>
                </div>
            )}
        </div>
    );
}; 