import React from 'react';
import { useWallet } from '../contexts/WalletContext.js';
import { formatDistance } from 'date-fns';

export function WalletTransactions() {
    const { transactions } = useWallet();

    return (
        <div className="wallet-transactions">
            <h3>Recent Transactions</h3>
            <div className="transaction-list">
                {transactions.length === 0 ? (
                    <p className="no-transactions">No transactions yet</p>
                ) : (
                    transactions.map(tx => (
                        <div key={tx.hash} className={`transaction-item ${tx.status}`}>
                            <div className="transaction-info">
                                <span className="type">{tx.type}</span>
                                <span className="hash">
                                    {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                                </span>
                            </div>
                            <div className="transaction-status">
                                <span className="status">{tx.status}</span>
                                <span className="time">
                                    {formatDistance(tx.timestamp, new Date(), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 