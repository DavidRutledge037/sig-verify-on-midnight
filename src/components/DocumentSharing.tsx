import React, { useState } from 'react';
import { DocumentWorkflowService } from '../services/DocumentWorkflowService';

interface Props {
    documentId: string;
    ownerDid: string;
}

export const DocumentSharing: React.FC<Props> = ({ documentId, ownerDid }) => {
    const [recipientDid, setRecipientDid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleShare = async () => {
        try {
            setLoading(true);
            setError(null);

            // Share document logic here
            // This would generate new ZK proofs and re-encrypt for the recipient

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sharing failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="document-sharing">
            <h3>Share Document</h3>
            <input
                type="text"
                placeholder="Recipient DID"
                value={recipientDid}
                onChange={e => setRecipientDid(e.target.value)}
            />
            <button 
                onClick={handleShare} 
                disabled={loading || !recipientDid}
            >
                {loading ? 'Sharing...' : 'Share Document'}
            </button>
            {error && <div className="error">{error}</div>}
        </div>
    );
}; 