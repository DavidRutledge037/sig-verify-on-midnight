import React, { useState } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentSignature } from './DocumentSignature';
import { PIIRedaction } from './PIIRedaction';
import { TransactionHistory } from './TransactionHistory';
import { WalletInfo } from '../services/WalletService';
import { DocumentWorkflowService } from '../services/DocumentWorkflowService';

interface Props {
    walletInfo: WalletInfo;
    userDid: string;
}

export const DocumentWorkflow: React.FC<Props> = ({ walletInfo, userDid }) => {
    const [activeStep, setActiveStep] = useState<'upload' | 'redact' | 'sign'>('upload');
    const [documentId, setDocumentId] = useState<string | null>(null);

    const handleUploadComplete = (docId: string) => {
        setDocumentId(docId);
        setActiveStep('redact');
    };

    const handleRedactionComplete = () => {
        setActiveStep('sign');
    };

    return (
        <div className="document-workflow">
            <div className="workflow-steps">
                {activeStep === 'upload' && (
                    <DocumentUpload
                        ownerDid={userDid}
                        onUploadComplete={handleUploadComplete}
                    />
                )}
                {activeStep === 'redact' && documentId && (
                    <PIIRedaction
                        documentId={documentId}
                        onRedactionComplete={handleRedactionComplete}
                    />
                )}
                {activeStep === 'sign' && documentId && (
                    <DocumentSignature
                        documentId={documentId}
                        signerDid={userDid}
                        walletInfo={walletInfo}
                    />
                )}
            </div>
            <TransactionHistory
                walletAddress={walletInfo.address}
            />
        </div>
    );
}; 