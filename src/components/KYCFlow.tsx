import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { KYCService } from '../services/kyc/kycService';
import { WalletDIDService } from '../services/did/walletDIDService';

export const KYCFlow: React.FC = () => {
  const { address, isConnected } = useWallet();
  const [step, setStep] = useState<'initial' | 'kyc' | 'creating-did' | 'complete'>('initial');
  const [error, setError] = useState<string | null>(null);

  const handleStartKYC = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setStep('kyc');
      const kycService = new KYCService('https://api.midnight.test');
      const sessionId = await kycService.initiateKYC(address);

      // Here you would typically redirect to KYC provider
      // For now, we'll simulate completion
      setStep('creating-did');
      
      // Generate proof and create DID
      const proof = await kycService.generateZKProof({ sessionId });
      const walletDIDService = new WalletDIDService(/* services */);
      const did = await walletDIDService.createWalletDID(proof);

      if (did) {
        setStep('complete');
      } else {
        throw new Error('Failed to create DID');
      }
    } catch (err) {
      setError('KYC process failed');
      setStep('initial');
      console.error(err);
    }
  };

  return (
    <div className="kyc-flow">
      {step === 'initial' && (
        <button 
          onClick={handleStartKYC}
          disabled={!isConnected}
          className="start-kyc-button"
        >
          Start KYC Process
        </button>
      )}

      {step === 'kyc' && (
        <div className="kyc-status">
          Completing KYC verification...
        </div>
      )}

      {step === 'creating-did' && (
        <div className="did-status">
          Creating your DID...
        </div>
      )}

      {step === 'complete' && (
        <div className="success-message">
          KYC and DID creation complete!
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}; 