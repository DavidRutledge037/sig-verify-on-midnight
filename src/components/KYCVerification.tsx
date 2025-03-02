'use client';

import { useState } from 'react';
import { MidnightLaceWallet } from '@/lib/wallet/midnight-lace';

interface KYCVerificationProps {
  did: string;
  onComplete: (level: 'L1' | 'L2' | 'L3') => void;
}

export function KYCVerification({ did, onComplete }: KYCVerificationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'L1' | 'L2' | 'L3'>('L1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const wallet = MidnightLaceWallet.getInstance();

      // Step 1: Submit KYC
      console.log('Submitting KYC...');
      await wallet.executeContract('kyc_verification', 'submit_kyc', []);

      // Step 2: Check KYC status
      console.log('Checking KYC status...');
      const kycStatus = await wallet.queryContract('kyc_verification', 'get_kyc_status', [did]);
      console.log('KYC Status:', kycStatus);

      onComplete(selectedLevel);
    } catch (error) {
      console.error('Error during KYC verification:', error);
      setError('Failed to complete KYC verification. Please try again.');
    } finally {
      setLoading(false);
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
        <p className="text-sm font-medium">DID</p>
        <p className="font-mono text-sm">{did}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select KYC Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as 'L1' | 'L2' | 'L3')}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="L1">Basic (L1) - Email & Basic Identity</option>
            <option value="L2">Standard (L2) - Government ID & Address</option>
            <option value="L3">Enhanced (L3) - Professional Verification</option>
          </select>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="font-medium mb-2">Requirements for {selectedLevel}</h3>
          {selectedLevel === 'L1' && (
            <ul className="list-disc list-inside text-sm">
              <li>Valid email address</li>
              <li>Basic identity information</li>
              <li>Enables signing of basic documents</li>
            </ul>
          )}
          {selectedLevel === 'L2' && (
            <ul className="list-disc list-inside text-sm">
              <li>Government-issued ID</li>
              <li>Proof of address</li>
              <li>Enables signing of legal documents</li>
            </ul>
          )}
          {selectedLevel === 'L3' && (
            <ul className="list-disc list-inside text-sm">
              <li>Professional credentials</li>
              <li>Video verification</li>
              <li>Additional documentation</li>
              <li>Enables signing of regulated documents</li>
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded ${
            loading
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {loading ? 'Verifying...' : 'Complete KYC Verification'}
        </button>
      </form>
    </div>
  );
}
