import React, { useState } from 'react';
import { KYCManager } from '../contracts/KYCManager';
import { VerificationLevel } from '../types/kyc';

interface Props {
    kycManager: KYCManager;
    did: string;
    onVerificationComplete: () => void;
}

export const KYCVerification: React.FC<Props> = ({ kycManager, did, onVerificationComplete }) => {
    const [level, setLevel] = useState<VerificationLevel>(VerificationLevel.BASIC);
    const [proofs, setProofs] = useState<Map<string, string>>(new Map());
    const [loading, setLoading] = useState(false);

    const handleAddProof = (type: string, value: string) => {
        setProofs(new Map(proofs.set(type, value)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await kycManager.verifyIdentity(did, level, proofs);
            onVerificationComplete();
        } catch (error) {
            console.error('KYC verification failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="kyc-verification">
            <h2>KYC Verification</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Verification Level:</label>
                    <select value={level} onChange={e => setLevel(e.target.value as VerificationLevel)}>
                        {Object.values(VerificationLevel).map(value => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <h3>Proofs</h3>
                    <button
                        type="button"
                        onClick={() => handleAddProof('identity', 'sample_proof')}
                    >
                        Add Identity Proof
                    </button>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Submit Verification'}
                </button>
            </form>
        </div>
    );
}; 