import { MidnightLaceWallet } from '../wallet/midnight-lace';

export type DocumentType = 'Basic' | 'Legal' | 'Regulated';

export interface SignatureStatus {
  signer: string;
  document: string;
  signature: string;
  timestamp: number;
  docType: DocumentType;
}

export class SignatureService {
  private wallet: MidnightLaceWallet;
  
  constructor(wallet: MidnightLaceWallet) {
    this.wallet = wallet;
  }

  /**
   * Sign a document
   * @param documentHash Hash of the document to sign
   * @param did Signer's DID
   * @param documentType Type of document being signed
   */
  async signDocument(documentHash: string, did: string, documentType: DocumentType): Promise<void> {
    try {
      await this.wallet.executeContract('signature_circuit', 'sign_document', [
        documentHash,
        did,
        documentType
      ]);
    } catch (error) {
      console.error('Failed to sign document:', error);
      throw error;
    }
  }

  /**
   * Verify a document's signature
   * @param documentHash Hash of the document to verify
   */
  async verifySignature(documentHash: string): Promise<boolean> {
    try {
      const result = await this.wallet.executeContract('signature_circuit', 'verify_signature', [
        documentHash
      ]);
      return result === 1;
    } catch (error) {
      console.error('Failed to verify signature:', error);
      throw error;
    }
  }

  /**
   * Get the signature status for a document
   * @param documentHash Hash of the document
   */
  async getSignatureStatus(documentHash: string): Promise<SignatureStatus> {
    try {
      const result = await this.wallet.executeContract('signature_circuit', 'get_signature', [
        documentHash
      ]);
      return result;
    } catch (error) {
      console.error('Failed to get signature status:', error);
      throw error;
    }
  }
}
