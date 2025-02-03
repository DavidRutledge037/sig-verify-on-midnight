import React, { useState } from 'react';
import { DIDManager } from '../contracts/DIDManager';

interface Props {
    didManager: DIDManager;
    onRegistrationComplete: (did: string) => void;
}

export const DIDRegistration: React.FC<Props> = ({ didManager, onRegistrationComplete }) => {
    const [address, setAddress] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const did = await didManager.createDID(address, publicKey);
            onRegistrationComplete(did);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="did-registration">
            <h2>Register DID</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Public Key:</label>
                    <input
                        type="text"
                        value={publicKey}
                        onChange={e => setPublicKey(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register DID'}
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}; 