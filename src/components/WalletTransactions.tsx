import React from 'react';
import { useWallet } from '../contexts/WalletContext';

export const WalletTransactions: React.FC = () => {
    const { transactions = [] } = useWallet();
    console.log('Current transactions:', transactions); // Debug log

    return (
        <div className="wallet-transactions">
            <h3>Recent Transactions</h3>
            <div className="transaction-list">
                {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <div key={tx.id} className="transaction">
                            <div className="transaction-details">
                                <span className="status">{tx.status}</span>
                                {tx.hash && (
                                    <div className="hash-container">
                                        <span className="type">{tx.type}</span>
                                        <span className="hash">
                                            {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-transactions">No transactions yet</p>
                )}
            </div>
        </div>
    );
}; 