import { ContractSimulator } from './simulators/did-simulator';
import { KYCSimulator, KYCLevel } from './simulators/kyc-simulator';
import { SignatureSimulator } from './simulators/signature-simulator';

// Contract instances
let didContractInstance: ContractSimulator | null = null;
let kycContractInstance: KYCSimulator | null = null;
let signatureContractInstance: SignatureSimulator | null = null;

export async function initializeContracts() {
  try {
    // Initialize all contract simulators
    didContractInstance = new ContractSimulator();
    kycContractInstance = new KYCSimulator();
    signatureContractInstance = new SignatureSimulator();
    
    await didContractInstance.init();
    console.log('Contracts initialized successfully');
  } catch (error) {
    console.error('Error initializing contracts:', error);
    throw error;
  }
}

export async function registerDID(publicKey: string): Promise<string> {
  if (!didContractInstance) {
    throw new Error('DID contract not initialized');
  }

  try {
    const did = await didContractInstance.registerDocument(publicKey);
    return did;
  } catch (error) {
    console.error('Error registering DID:', error);
    throw error;
  }
}

export async function verifyKYC(did: string, level: KYCLevel): Promise<boolean> {
  if (!kycContractInstance) {
    throw new Error('KYC contract not initialized');
  }

  try {
    switch (level) {
      case 'L1':
        return await kycContractInstance.verifyL1(did, 'test@example.com');
      case 'L2':
        return await kycContractInstance.verifyL2(did, 'GOV-ID-123', true);
      case 'L3':
        return await kycContractInstance.verifyL3(
          did,
          ['additional-doc-1'],
          true,
          ['professional-credential-1']
        );
      default:
        return false;
    }
  } catch (error) {
    console.error('Error verifying KYC:', error);
    throw error;
  }
}

export async function signDocument(
  did: string,
  documentHash: string,
  documentType: 'Basic' | 'Legal' | 'Regulated'
): Promise<boolean> {
  if (!kycContractInstance || !signatureContractInstance) {
    throw new Error('Contracts not initialized');
  }

  try {
    // First check if the user has the required KYC level
    const canSign = await kycContractInstance.canSignDocumentType(did, documentType);
    if (!canSign) {
      throw new Error(`Insufficient KYC level to sign ${documentType} documents`);
    }

    // If authorized, sign the document
    const signatureHash = await signatureContractInstance.signDocument(did, documentHash, documentType);
    return true;
  } catch (error) {
    console.error('Error signing document:', error);
    throw error;
  }
}
