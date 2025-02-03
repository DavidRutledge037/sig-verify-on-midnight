import React, { useState } from 'react';
import { TransactionService, TransactionConfig } from '../services/TransactionService';
import { WalletInfo } from '../services/WalletService';

interface Props {
    walletInfo: WalletInfo;
    transactionService: TransactionService;
    config: TransactionConfig;
    onComplete: (txHash: string) => void;
}

export const TransactionSigning: React.FC<Props> = ({
    walletInfo,
    transactionService,
    config,
    onComplete
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleSign = async () => {
        try {
            setLoading(true);
            setError(null);
            setStatus('Building transaction...');

            // 1. Build transaction
            const transaction = await transactionService.buildTransaction(config);

            // 2. Sign and submit
            setStatus('Signing with Lace wallet...');
            const result = await transactionService.signAndSubmit(transaction);

            // 3. Monitor status
            setStatus('Monitoring transaction...');
            const finalStatus = await monitorTransaction(result.txHash);

            if (finalStatus === 'confirmed') {
                onComplete(result.txHash);
            } else {
                throw new Error(`Transaction ${finalStatus}`);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Transaction failed');
        } finally {
            setLoading(false);
            setStatus(null);
        }
    };

    const monitorTransaction = async (txHash: string): Promise<string> => {
        let status = 'pending';
        let attempts = 0;
        const maxAttempts = 10;

        while (status === 'pending' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            status = await transactionService.getTransactionStatus(txHash);
            attempts++;
            setStatus(`Confirming transaction (attempt ${attempts}/${maxAttempts})...`);
        }

        return status;
    };

    return (
        <div className="transaction-signing">
            <h3>Sign Transaction</h3>
            <div className="transaction-details">
                <p>Type: {config.type}</p>
                <p>Action: {config.action}</p>
                <p>Network: {walletInfo.network}</p>
            </div>
            <button 
                onClick={handleSign}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Sign & Submit'}
            </button>
            {status && <div className="status">{status}</div>}
            {error && <div className="error">{error}</div>}
        </div>
    );
}; 