import React, { useState, useEffect } from 'react';
import { TransactionService } from '../services/TransactionService';
import { TransactionStatus } from '../types/transaction';

interface Props {
    transactionService: TransactionService;
    walletAddress: string;
}

export const TransactionHistory: React.FC<Props> = ({
    transactionService,
    walletAddress
}) => {
    const [transactions, setTransactions] = useState<TransactionStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTransactions();
    }, [walletAddress]);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            // In production, this would load from Midnight network
            const txs = [
                {
                    txHash: 'hash1',
                    status: 'confirmed' as const,
                    confirmations: 10,
                    timestamp: Date.now()
                }
            ];
            setTransactions(txs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transaction-history">
            <h3>Transaction History</h3>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="transactions">
                    {transactions.map(tx => (
                        <div key={tx.txHash} className="transaction">
                            <p>Hash: {tx.txHash}</p>
                            <p>Status: {tx.status}</p>
                            <p>Confirmations: {tx.confirmations}</p>
                            <p>Time: {new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 