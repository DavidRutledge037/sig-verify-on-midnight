import React, { useState } from 'react';
import { ZKProofGenerator } from '../utils/zkProofs';

interface Props {
    documentId: string;
    onRedactionComplete: (proofs: Map<string, string>) => void;
}

export const PIIRedaction: React.FC<Props> = ({ documentId, onRedactionComplete }) => {
    const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    const piiFields = [
        'name',
        'address',
        'ssn',
        'dob',
        'phoneNumber'
    ];

    const handleRedact = async () => {
        setLoading(true);
        const proofs = new Map<string, string>();
        
        for (const field of selectedFields) {
            // Generate ZK proof for each field
            const proof = await new ZKProofGenerator().generateDocumentProof(
                Buffer.from(field),
                'owner',
                'private_key'
            );
            proofs.set(field, proof.proof);
        }

        onRedactionComplete(proofs);
        setLoading(false);
    };

    return (
        <div className="pii-redaction">
            <h3>Select PII to Redact</h3>
            {piiFields.map(field => (
                <label key={field}>
                    <input
                        type="checkbox"
                        checked={selectedFields.has(field)}
                        onChange={e => {
                            const newFields = new Set(selectedFields);
                            if (e.target.checked) {
                                newFields.add(field);
                            } else {
                                newFields.delete(field);
                            }
                            setSelectedFields(newFields);
                        }}
                    />
                    {field}
                </label>
            ))}
            <button 
                onClick={handleRedact} 
                disabled={loading || selectedFields.size === 0}
            >
                {loading ? 'Generating Proofs...' : 'Redact Selected Fields'}
            </button>
        </div>
    );
}; 