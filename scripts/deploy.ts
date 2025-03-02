import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { MidnightLaceWallet } from '../src/lib/wallet/midnight-lace';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function main() {
  try {
    // Get wallet instance
    const wallet = MidnightLaceWallet.getInstance();
    
    // Connect wallet
    const connected = await wallet.connect();
    if (!connected) {
      throw new Error('Failed to connect wallet');
    }
    console.log('Connected to wallet');

    // Read contract bytecode
    const contractPath = join(__dirname, '../src/contracts/signatures/signature_verification.compact');
    console.log('Reading contract from:', contractPath);
    const bytecode = readFileSync(contractPath);

    console.log('Deploying signature verification contract...');
    
    // Deploy contract
    const deployTx = await wallet.deployContract(bytecode.toString('hex'), {
      documents: new Map(),
      signatures: new Map(),
      revoked: new Map(),
      versions: new Map(),
      signerCounts: new Map()
    });

    console.log('Contract deployed successfully!');
    console.log('Contract address:', deployTx.contractAddress);
    
    // Save contract address for future use
    const deploymentInfo = {
      contractAddress: deployTx.contractAddress,
      networkId: NetworkId.TestNet,
      timestamp: new Date().toISOString()
    };
    
    const deploymentPath = join(__dirname, '../deployment.json');
    writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log('Deployment info saved to:', deploymentPath);

  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

main();
