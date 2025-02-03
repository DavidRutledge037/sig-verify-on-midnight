import React from 'react';
import { useWallet } from '../contexts/WalletContext.js';

export function DocumentSigning() {
    const { wallet } = useWallet();

    const handleSign = async () => {
        // Implement signing logic
    };

    return (
        <div className="document-signing">
            <h2>Sign Document</h2>
            <button onClick={handleSign}>Sign Document</button>
        </div>
    );
} 