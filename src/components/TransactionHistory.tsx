import React from 'react';
import { useWallet } from '../contexts/WalletContext';

interface Transaction {
    id: string;
    type: 'sign' | 'verify';
    timestamp: Date;
    documentName: string;
    status: 'completed' | 'pending' | 'failed';
}

export const TransactionHistory: React.FC = () => {
    // Mock transaction data
    const mockTransactions: Transaction[] = [
        {
            id: '1',
            type: 'sign',
            timestamp: new Date(),
            documentName: 'contract.pdf',
            status: 'completed'
        },
        {
            id: '2',
            type: 'verify',
            timestamp: new Date(Date.now() - 86400000),
            documentName: 'agreement.pdf',
            status: 'completed'
        }
    ];

    return (
        <div className="transaction-history">
            <h2>Transaction History</h2>
            
            <div className="transactions-list">
                {mockTransactions.length > 0 ? (
                    mockTransactions.map(tx => (
                        <div key={tx.id} className="transaction-item">
                            <div className="transaction-icon">
                                {tx.type === 'sign' ? '📝' : '✓'}
                            </div>
                            <div className="transaction-details">
                                <h3>{tx.type === 'sign' ? 'Document Signed' : 'Document Verified'}</h3>
                                <p>{tx.documentName}</p>
                                <span className="transaction-date">
                                    {tx.timestamp.toLocaleDateString()}
                                </span>
                            </div>
                            <div className={`transaction-status status-${tx.status}`}>
                                {tx.status}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-transactions">
                        <p>No transactions found</p>
                    </div>
                )}
            </div>
        </div>
    );
}; 