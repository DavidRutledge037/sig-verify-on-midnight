import { useState } from 'react';
import { useMidnightLace } from '../lib/wallet/use-midnight-lace';
import { NETWORK_CONFIG } from '../config/network';

interface SignatureRequest {
  documentHash: string;
  signer: string;
  signature: string;
  kycLevel: number;
}

interface DocumentSigningProps {
  did: string;
  kycLevel: 'L1' | 'L2' | 'L3';
  onComplete: (proof: any) => void;
}

type DocumentType = 'Basic' | 'Legal' | 'Regulated';

const KYC_LEVEL_REQUIREMENTS: Record<DocumentType, 'L1' | 'L2' | 'L3'> = {
  Basic: 'L1',
  Legal: 'L2',
  Regulated: 'L3'
};

export function DocumentSigning({ did, kycLevel, onComplete }: DocumentSigningProps) {
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentHash, setDocumentHash] = useState<Uint8Array | null>(null);
  const { wallet } = useMidnightLace();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    setDocumentHash(new Uint8Array(hashBuffer));
  };

  const handleSign = async () => {
    if (!wallet || !documentHash) {
      setError('Wallet not connected or no document selected');
      return;
    }

    setSigning(true);
    setError(null);

    try {
      const signature = await wallet.signMessage(documentHash);
      const address = await wallet.getAddress();
      const kycLevel = (await wallet.getState()).kycLevel || 0;

      // Create signature request
      const request: SignatureRequest = {
        documentHash: Buffer.from(documentHash).toString('hex'),
        signer: address,
        signature: Buffer.from(signature).toString('hex'),
        kycLevel
      };

      // Send request to proof server
      const response = await fetch(`${NETWORK_CONFIG.PROOF_SERVER_URL}/api/v1/signatures/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Failed to sign document');
      }

      const data = await response.json();
      console.log('Document signed successfully:', data);

      onComplete({
        did,
        documentHash,
        documentType: 'Basic',
        timestamp: Date.now(),
        proof: 'mock_proof_' + Math.random().toString(36).substring(7)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign document');
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Document Signing</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <button
        onClick={handleSign}
        disabled={signing || !wallet || !documentHash}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {signing ? 'Signing...' : 'Sign Document'}
      </button>
    </div>
  );
}
