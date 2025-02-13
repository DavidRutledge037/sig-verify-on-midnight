import { createHash } from 'crypto';
import { WalletService } from './wallet';
import { DIDService } from './did';

export class DocumentService {
  readonly #wallet: WalletService;
  readonly #didService: DIDService;
  private documentStore: Map<string, { hash: Uint8Array; did: string }>;
  private readonly MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

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
    if (!did.match(/^did:midnight:[a-fA-F0-9]{64}$/)) {
      throw new Error('Invalid DID format');
    }

    const isOwner = await this.#didService.verifyDIDOwnership(did);
    if (!isOwner) {
      throw new Error('DID ownership verification failed');
    }

    const hash = await this.hashDocument(document);
    const record = { hash, did };
    
    if (this.documentStore.has(hash.toString())) {
      throw new Error('Document already exists');
    }

    this.documentStore.set(hash.toString(), record);
    return record;
  }

  async verifyDocumentOwnership(hash: Uint8Array, did: string): Promise<boolean> {
    const record = this.documentStore.get(hash.toString());
    if (!record) return false;
    
    if (!did.match(/^did:midnight:[a-fA-F0-9]{64}$/)) {
      return false;
    }
    return record.did === did && await this.#didService.verifyDIDOwnership(did);
  }

  async getDocumentHistory(hash: Uint8Array): Promise<string[]> {
    const record = this.documentStore.get(hash.toString());
    return record ? [record.did] : [];
  }
}
