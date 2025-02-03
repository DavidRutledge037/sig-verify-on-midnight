import React, { useState } from 'react';
import { ZKProofGenerator } from '../utils/zkProofs';
import { TransactionSigning } from './TransactionSigning';
import { TransactionService } from '../services/TransactionService';
import { WalletInfo } from '../services/WalletService';

interface Props {
    documentId: string;
    signerDid: string;
    walletInfo: WalletInfo;
    transactionService: TransactionService;
}

export const DocumentSignature: React.FC<Props> = ({
    documentId,
    signerDid,
    walletInfo,
    transactionService
}) => {
    const [signed, setSigned] = useState(false);

    const handleSignComplete = (txHash: string) => {
        console.log('Document signed:', txHash);
        setSigned(true);
    };

    return (
        <div className="document-signature">
            <h3>Sign Document</h3>
            {!signed ? (
                <TransactionSigning
                    walletInfo={walletInfo}
                    transactionService={transactionService}
                    config={{
                        type: 'document',
                        action: 'sign',
                        metadata: {
                            documentId,
                            signerDid
                        }
                    }}
                    onComplete={handleSignComplete}
                />
            ) : (
                <div className="success">Document signed successfully!</div>
            )}
        </div>
    );
}; 