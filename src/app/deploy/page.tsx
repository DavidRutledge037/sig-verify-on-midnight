'use client';

import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { useCallback, useEffect, useState } from 'react';
import { MidnightLaceWallet } from '@/lib/wallet/midnight-lace';

export default function DeployPage() {
  const [wallet] = useState(() => MidnightLaceWallet.getInstance());
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Connect wallet on page load
  useEffect(() => {
    const connect = async () => {
      if (connecting || connected) return;
      
      try {
        setConnecting(true);
        setStatus('Connecting to wallet...');
        setError(null);

        const success = await wallet.connect();
        if (!success) {
          setError('Failed to connect to wallet');
          return;
        }

        // Verify wallet state
        const state = await wallet.getState();
        if (!state) {
          setError('Failed to get wallet state');
          return;
        }

        setConnected(true);
        setStatus('Wallet connected! Ready to deploy contract.');
        console.log('Connected with state:', state);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setConnected(false);
      } finally {
        setConnecting(false);
      }
    };

    connect();
  }, [wallet, connecting, connected]);

  const handleDeploy = useCallback(async () => {
    if (!connected) {
      setError('Wallet not connected');
      return;
    }

    try {
      setStatus('Reading contract bytecode...');
      setError(null);

      // Read contract bytecode
      const response = await fetch('/contracts/signatures/signature_verification.compact');
      const bytecode = await response.arrayBuffer();

      setStatus('Deploying signature verification contract...');
      
      // Deploy contract
      const deployTx = await wallet.deployContract(
        Buffer.from(bytecode).toString('hex'),
        {
          documents: new Map(),
          signatures: new Map(),
          revoked: new Map(),
          versions: new Map(),
          signerCounts: new Map()
        }
      );

      console.log('Contract deployed successfully!');
      console.log('Contract address:', deployTx.contractAddress);
      
      setContractAddress(deployTx.contractAddress);
      setStatus('Contract deployed successfully!');

      // Save deployment info
      const deploymentInfo = {
        contractAddress: deployTx.contractAddress,
        networkId: NetworkId.TestNet,
        timestamp: new Date().toISOString()
      };

      // Save to local storage for now
      localStorage.setItem('deploymentInfo', JSON.stringify(deploymentInfo));

    } catch (err) {
      console.error('Deployment failed:', err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setStatus('Deployment failed');
    }
  }, [wallet, connected]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Deploy KYC Contract
          </h1>
          
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                connected ? 'bg-green-500' : 
                connecting ? 'bg-yellow-500 animate-pulse' : 
                'bg-red-500'
              }`} />
              <p className="text-lg font-medium text-gray-200">
                {connecting ? 'Connecting to wallet...' : 
                 connected ? 'Wallet connected' : 
                 'Wallet disconnected'}
              </p>
            </div>

            <div className="space-y-4">
              {status && (
                <p className="text-gray-300">{status}</p>
              )}
              
              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded p-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {contractAddress && (
                <div className="bg-gray-900/50 border border-gray-700 rounded p-4">
                  <p className="text-sm text-gray-400 mb-2">Contract Address</p>
                  <p className="font-mono text-sm break-all text-blue-400">{contractAddress}</p>
                </div>
              )}
            </div>
          </div>

          {connected && !contractAddress && (
            <button
              onClick={handleDeploy}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={connecting}
            >
              Deploy Contract
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
