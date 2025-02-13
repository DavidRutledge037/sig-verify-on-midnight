import { createHash } from 'crypto';
import { WalletService } from './wallet';
import { DIDService } from './did';

export class DocumentService {
  readonly #wallet: WalletService;
  readonly #didService: DIDService;
  private documentStore: Map<string, { hash: Uint8Array; did: string }>;
  private readonly MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB limit

  constructor(wallet: WalletService, didService: DIDService) {
    this.#wallet = wallet;
    this.#didService = didService;
    this.documentStore = new Map();
  }

  async hashDocument(document: Uint8Array): Promise<Uint8Array> {
    if (document.length === 0) {
      throw new Error('Empty document');
    }
    if (document.length > this.MAX_DOCUMENT_SIZE) {
      throw new Error('Document size exceeds limit');
    }
    const hash = createHash('sha256');
    hash.update(document);
    return new Uint8Array(hash.digest());
  }

  async storeDocument(document: Uint8Array, did: string): Promise<{ hash: Uint8Array; did: string }> {
    // Validate DID format
    if (!did.match(/^did:midnight:[a-fA-F0-9]{64}$/)) {
      throw new Error('Invalid DID format');
    }

    // Verify DID ownership
    const isOwner = await this.#didService.verifyDIDOwnership(did);
    if (!isOwner) {
      throw new Error('DID ownership verification failed');
    }

    const hash = await this.hashDocument(document);
    const record = { hash, did };
    
    // Check for existing document
    if (this.documentStore.has(hash.toString())) {
      throw new Error('Document already exists');
    }

    this.documentStore.set(hash.toString(), record);
    return record;
  }

  async verifyDocumentOwnership(hash: Uint8Array, did: string): Promise<boolean> {
    const record = this.documentStore.get(hash.toString());
    if (!record) return false;
    
    // Verify DID format and ownership
    if (!did.match(/^did:midnight:[a-fA-F0-9]{64}$/)) {
      return false;
    }
    return record.did === did && await this.#didService.verifyDIDOwnership(did);
  }

  async getDocumentHistory(hash: Uint8Array): Promise<string[]> {
    const record = this.documentStore.get(hash.toString());
    return record ? [record.did] : [];
  }

  async verifySignature(document: Uint8Array, signature: Uint8Array, did: string): Promise<boolean> {
    if (!this.#didService.validateDIDFormat(did)) {
      throw new Error('Invalid DID format');
    }
    if (document.length === 0) {
      throw new Error('Empty document');
    }
    return this.#wallet.verify(document, signature);
  }

  async signDocument(document: Uint8Array, did: string): Promise<Uint8Array> {
    if (document.length === 0) {
      throw new Error('Empty document');
    }
    if (!this.#didService.validateDIDFormat(did)) {
      throw new Error('Invalid DID format');
    }
    return this.#didService.signWithDID(did, document);
  }
} 