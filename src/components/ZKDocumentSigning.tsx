import React, { useState, useEffect } from 'react';
import type { DocumentType } from '../lib/proof/types';
import { SignatureProofProvider } from '../lib/proof/signature-proof-provider';
import { NetworkId } from '../lib/proof/types';
import { UnprovenTransaction } from '@midnight-ntwrk/midnight-js-types';

interface ZKDocumentSigningProps {
  did: string;
  kycLevel: 'L1' | 'L2' | 'L3';
  onSigningComplete: (proof: Uint8Array) => void;
}

const ZKDocumentSigning: React.FC<ZKDocumentSigningProps> = ({
  did,
  kycLevel,
  onSigningComplete
}) => {
  const [document, setDocument] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.Basic);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map KYC levels to allowed document types
  const allowedDocumentTypes = {
    'L1': [DocumentType.Basic],
    'L2': [DocumentType.Basic, DocumentType.Legal],
    'L3': [DocumentType.Basic, DocumentType.Legal, DocumentType.Regulated]
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
      setError(null);
    }
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(parseInt(e.target.value) as DocumentType);
    setError(null);
  };

  const generateDocumentHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSign = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!document) {
        throw new Error('Please select a document');
      }

      // Check KYC level requirements
      const allowed = allowedDocumentTypes[kycLevel];
      if (!allowed.includes(documentType)) {
        throw new Error(`Your KYC level (${kycLevel}) is not sufficient for this document type`);
      }

      // Generate document hash
      const documentHash = await generateDocumentHash(document);

      // Create unproven transaction
      const unprovenTx: UnprovenTransaction = {
        calls: [{
          circuitId: 'signature.prove_ownership',
          publicInputs: {
            did,
            documentType
          },
          privateInputs: {
            secretKey: crypto.getRandomValues(new Uint8Array(32)), // In production, get from wallet
            documentHash,
            signatureData: crypto.getRandomValues(new Uint8Array(64)) // In production, generate proper signature
          }
        }],
        networkId: NetworkId.Devnet,
        timestamp: Date.now()
      };

      // Get proof provider
      const proofProvider = SignatureProofProvider.getInstance(NetworkId.Devnet);

      // Generate proof
      const unbalancedTx = await proofProvider.proveTx(unprovenTx);

      // In production, this would be sent to a WalletProvider for balancing
      // For now, we'll just use the first proof
      onSigningComplete(unbalancedTx.proofs[0]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Zero-Knowledge Document Signing</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Document
          <input
            type="file"
            onChange={handleDocumentChange}
            className="mt-1 block w-full"
            disabled={loading}
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Document Type
          <select
            value={documentType}
            onChange={handleDocumentTypeChange}
            className="mt-1 block w-full rounded-md border-gray-300"
            disabled={loading}
          >
            <option value={DocumentType.Basic}>Basic</option>
            <option value={DocumentType.Legal}>Legal</option>
            <option value={DocumentType.Regulated}>Regulated</option>
          </select>
        </label>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSign}
        disabled={loading || !document}
        className={`w-full py-2 px-4 rounded-md text-white ${
          loading || !document
            ? 'bg-gray-400'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Generating Proof...' : 'Sign Document'}
      </button>

      <div className="text-sm text-gray-600">
        <p>Current KYC Level: {kycLevel}</p>
        <p>DID: {did}</p>
        <p>Network: {NetworkId.Devnet}</p>
      </div>
    </div>
  );
};

export default ZKDocumentSigning;
