import { DIDService } from './didService';
import { LaceWallet } from '../wallet/laceWallet';
import { ZKService } from '../zk/zkService';
import { DIDDocument } from '../../types/did';
import { ZKProof } from '../../types/zk';

export class WalletDIDService {
  constructor(
    private didService: DIDService,
    private wallet: LaceWallet,
    private zkService: ZKService
  ) {}

  async createWalletDID(kycProof: ZKProof): Promise<DIDDocument | null> {
    try {
      // 1. Verify wallet connection
      const isConnected = await this.wallet.connect();
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      // 2. Get wallet address
      const address = await this.wallet.getAddress();
      if (!address) {
        throw new Error('No wallet address available');
      }

      // 3. Sign a challenge to prove wallet ownership
      const challenge = `Create DID for ${address} at ${Date.now()}`;
      const signature = await this.wallet.signMessage(challenge);
      if (!signature) {
        throw new Error('Failed to sign challenge');
      }

      // 4. Generate ZK proof of wallet ownership
      const walletProof = await this.zkService.generateProof({
        privateInputs: {
          signature,
          address
        },
        publicInputs: {
          challenge
        }
      });

      // 5. Create DID with both KYC and wallet proofs
      const did = await this.didService.createDID({
        ...kycProof,
        walletProof
      });

      return did;
    } catch (error) {
      console.error('Failed to create wallet-linked DID:', error);
      return null;
    }
  }

  async verifyWalletDID(did: string): Promise<boolean> {
    try {
      // 1. Resolve DID document
      const didDoc = await this.didService.resolveDID(did);
      if (!didDoc) return false;

      // 2. Get current wallet address
      const currentAddress = await this.wallet.getAddress();
      if (!currentAddress) return false;

      // 3. Verify wallet ownership proof
      const isValid = await this.zkService.verifyProof({
        proof: didDoc.verificationMethod[0].proofValue,
        publicInputs: {
          address: currentAddress
        }
      });

      return isValid;
    } catch (error) {
      console.error('Failed to verify wallet DID:', error);
      return false;
    }
  }
} 