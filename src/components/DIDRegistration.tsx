import { useState } from 'react';
import { useMidnightLaceWallet } from '../lib/wallet/use-midnight-lace';
import { NETWORK_CONFIG } from '../config/network';

interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
}

interface Service {
  id: string;
  type: string;
  serviceEndpoint: string;
}

interface DIDRegistrationProps {
  walletAddress: string;
  onComplete: (did: string) => void;
}

export function DIDRegistration({ walletAddress, onComplete }: DIDRegistrationProps) {
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wallet = useMidnightLaceWallet();

  const handleRegister = async () => {
    if (!wallet) {
      setError('Wallet not connected');
      return;
    }

    setRegistering(true);
    setError(null);

    try {
      const address = await wallet.getAddress();
      const verificationMethods: VerificationMethod[] = [{
        id: 'key-1',
        type: 'Ed25519VerificationKey2020',
        controller: address,
        publicKeyMultibase: 'z123456789abcdef'
      }];

      const services: Service[] = [];

      // Create DID registration request
      const request = {
        controller: address,
        verificationMethods,
        services
      };

      // Send request to proof server
      const response = await fetch(`${NETWORK_CONFIG.PROOF_SERVER_URL}/api/v1/did/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Failed to register DID');
      }

      const data = await response.json();
      console.log('DID registered:', data.did);
      onComplete(data.did);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register DID');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-sm font-medium">Wallet Address</p>
        <p className="font-mono text-sm">{walletAddress}</p>
      </div>

      <button
        onClick={handleRegister}
        disabled={registering || !wallet}
        className={`w-full px-4 py-2 rounded ${
          registering
            ? 'bg-gray-400'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {registering ? 'Registering...' : 'Register DID'}
      </button>

      <div className="text-sm text-gray-600">
        <p>This will:</p>
        <ul className="list-disc list-inside">
          <li>Generate your DID from your wallet address</li>
          <li>Register it on the Midnight Network</li>
          <li>Create a zero-knowledge proof of ownership</li>
          <li>Enable document signing capabilities</li>
        </ul>
      </div>
    </div>
  );
}
