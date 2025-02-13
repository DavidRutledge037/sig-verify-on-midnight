import { WalletService } from './wallet';

export class DIDService {
  readonly #wallet: WalletService;
  
  constructor(wallet: WalletService) {
    this.#wallet = wallet;
  }

  async generateDID(): Promise<string> {
    const publicKey = await this.#wallet.getPublicKey();
    const pubKeyHex = Buffer.from(publicKey).toString('hex');
    return `did:midnight:${pubKeyHex}`;
  }

  validateDIDFormat(did: string): boolean {
    return did.startsWith('did:midnight:');
  }

  async signWithDID(did: string, document: Uint8Array): Promise<Uint8Array> {
    if (!document || document.length === 0) {
      throw new Error('Empty document');
    }

    if (!this.validateDIDFormat(did)) {
      throw new Error('Invalid DID format');
    }

    const pubKeyHex = did.split(':')[2];
    const expectedPublicKey = Buffer.from(pubKeyHex, 'hex');
    const actualPublicKey = await this.#wallet.getPublicKey();
    
    if (Buffer.compare(expectedPublicKey, actualPublicKey) !== 0) {
      throw new Error('DID ownership verification failed');
    }
    
    return this.#wallet.sign(document);
  }
} 