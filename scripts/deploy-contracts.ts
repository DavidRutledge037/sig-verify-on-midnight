import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { NETWORK_CONFIG } from '../src/config/network.js';
import { MidnightLaceWallet } from '../src/lib/wallet/midnight-lace.js';
import * as fs from 'fs/promises';
import * as path from 'path';

interface ContractInfo {
  name: string;
  version: string;
  bytecode: string;
  abi: any;
}

async function loadContractInfo(contractPath: string): Promise<ContractInfo> {
  try {
    // Load the contract info JSON
    const infoPath = path.join(process.cwd(), contractPath);
    const content = await fs.readFile(infoPath, 'utf-8');
    const info = JSON.parse(content);

    // Load the first .zkir file as bytecode
    const zkirDir = path.join(path.dirname(infoPath), '../zkir');
    const files = await fs.readdir(zkirDir);
    const zkirFile = files.find(f => f.endsWith('.zkir'));
    
    if (!zkirFile) {
      throw new Error('No .zkir file found');
    }
    
    const bytecode = await fs.readFile(path.join(zkirDir, zkirFile));
    
    return {
      name: path.basename(path.dirname(path.dirname(contractPath))),
      version: '1.0.0',
      bytecode: bytecode.toString('base64'),
      abi: info
    };
  } catch (error) {
    console.error('Failed to load contract info:', error);
    throw error;
  }
}

async function deployContract(contractInfo: ContractInfo): Promise<string> {
  const wallet = MidnightLaceWallet.getInstance();
  await wallet.connect();

  const address = await wallet.getAddress();
  console.log(`Deploying ${contractInfo.name} from address: ${address}`);
  console.log('Contract info:', {
    name: contractInfo.name,
    version: contractInfo.version,
    bytecodeLength: contractInfo.bytecode.length,
    numCircuits: contractInfo.abi.circuits.length,
    firstCircuit: contractInfo.abi.circuits[0].name
  });

  const request = {
    name: contractInfo.name,
    version: contractInfo.version,
    bytecode: contractInfo.bytecode,
    abi: contractInfo.abi,
    deployer: address
  };

  const url = `${NETWORK_CONFIG.PROOF_SERVER_URL}/api/v1/contracts/deploy`;
  console.log('Making request to:', url);
  console.log('Request body:', JSON.stringify(request, null, 2));
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Response status:', response.status);
    console.error('Response headers:', Object.fromEntries(response.headers.entries()));
    console.error('Error details:', error);
    throw new Error(`Failed to deploy contract: ${error}`);
  }

  const result = await response.json();
  return result.contractAddress;
}

async function main() {
  try {
    // Deploy DID Registry Contract
    const didRegistryInfo = await loadContractInfo('src/contracts/did/managed/did_registry/compiler/contract-info.json');
    const didRegistryAddress = await deployContract(didRegistryInfo);
    console.log('DID Registry deployed at:', didRegistryAddress);

    // Deploy Signature Verification Contract
    const sigVerificationInfo = await loadContractInfo('src/contracts/signatures/managed/signature_verification/compiler/contract-info.json');
    const sigVerificationAddress = await deployContract(sigVerificationInfo);
    console.log('Signature Verification deployed at:', sigVerificationAddress);

    // Save deployed addresses
    const deployments = {
      didRegistry: didRegistryAddress,
      signatureVerification: sigVerificationAddress,
      network: NETWORK_CONFIG.NETWORK,
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(process.cwd(), 'deployments.json'),
      JSON.stringify(deployments, null, 2)
    );

    console.log('Deployment successful! Addresses saved to deployments.json');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

main();
