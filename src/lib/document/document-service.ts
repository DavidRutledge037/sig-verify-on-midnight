import { createHash } from 'crypto';
import { SignatureProofProvider } from '../proof/signature-proof-provider';
import { WalletProvider } from '../wallet/types';

export enum DocumentStatus {
  Pending = 'Pending',
  Signed = 'Signed',
  Verified = 'Verified',
  Rejected = 'Rejected',
  Revoked = 'Revoked'
}

export interface DocumentMetadata {
  hash: string;
  name: string;
  size: number;
  timestamp: number;
  signer: string;
  owner: string;
  status: DocumentStatus;
  proof?: string;
}

export class DocumentService {
  private static instance: DocumentService | null = null;
  private proofProvider: SignatureProofProvider;
  private wallet: WalletProvider;

  private constructor(wallet: WalletProvider) {
    this.wallet = wallet;
    this.proofProvider = SignatureProofProvider.getInstance();
  }

  public static getInstance(wallet: WalletProvider): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService(wallet);
    }
    return DocumentService.instance;
  }

  public static resetInstance(): void {
    DocumentService.instance = null;
  }

  private calculateHash(content: Buffer): string {
    return createHash('sha256')
      .update(content)
      .digest('hex');
  }

  /**
   * Sign a document and generate a proof
   */
  public async signDocument(
    content: Buffer,
    name: string
  ): Promise<DocumentMetadata> {
    try {
      const hash = this.calculateHash(content);
      const did = await this.wallet.getDID();
      const secretKey = await this.wallet.getSecretKey();

      const proof = await this.proofProvider.generateProof(
        hash,
        did,
        secretKey
      );

      return {
        hash,
        name,
        size: content.length,
        timestamp: Date.now(),
        signer: did,
        owner: did,
        status: DocumentStatus.Signed,
        proof: proof.proof
      };
    } catch (error) {
      console.error('Failed to sign document:', error);
      throw new Error('Failed to sign document');
    }
  }

  /**
   * Verify a document signature
   */
  public async verifySignature(metadata: DocumentMetadata): Promise<boolean> {
    if (!metadata.proof) {
      return false;
    }

    try {
      return await this.proofProvider.verifyProof({
        proof: metadata.proof,
        publicInputs: {
          did: metadata.signer,
          documentHash: metadata.hash,
          timestamp: Math.floor(metadata.timestamp / 1000)
        }
      });
    } catch (error) {
      console.error('Failed to verify signature:', error);
      return false;
    }
  }
}
