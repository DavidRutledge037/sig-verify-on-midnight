import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext.js';
import { useNotification } from '../contexts/NotificationContext.js';
import { SignerRegistry } from '../contracts/SignerRegistry.js';
import { MidnightSDK } from '../sdk/midnight.js';

export function SignerRegistration() {
    const { wallet, connect } = useWallet();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [kycData, setKycData] = useState({
        name: '',
        email: '',
        idNumber: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!wallet) {
                await connect();
            }

            const sdk = new MidnightSDK({
                nodeUrl: process.env.REACT_APP_MIDNIGHT_NODE_URL!,
                chainId: process.env.REACT_APP_MIDNIGHT_CHAIN_ID!,
                privacyLevel: 'shielded'
            });

            const registry = new SignerRegistry(sdk);
            
            // Encrypt sensitive data
            const encryptedDetails = await sdk.encrypt(JSON.stringify(kycData));

            // Create KYC proofs
            const kycProofs = new Map([
                ['identity', await sdk.generateProof('identity', kycData.idNumber)],
                ['email', await sdk.generateProof('email', kycData.email)]
            ]);

            const pseudonym = await registry.registerSigner(
                wallet!.address,
                wallet!.publicKey,
                kycProofs,
                encryptedDetails
            );

            showNotification('success', 'Successfully registered as a signer!');
            
            // Store pseudonym securely
            localStorage.setItem('signer_pseudonym', pseudonym);

        } catch (error) {
            console.error('Registration failed:', error);
            showNotification('error', 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signer-registration">
            <h2>Register as a Document Signer</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={kycData.name}
                        onChange={e => setKycData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={kycData.email}
                        onChange={e => setKycData(prev => ({ ...prev, email: e.target.value }))}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="idNumber">ID Number</label>
                    <input
                        type="text"
                        id="idNumber"
                        value={kycData.idNumber}
                        onChange={e => setKycData(prev => ({ ...prev, idNumber: e.target.value }))}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
} 