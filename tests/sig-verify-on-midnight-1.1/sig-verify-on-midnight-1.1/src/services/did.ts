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

  async verifyDIDOwnership(did: string): Promise<boolean> {
    const pubKeyHex = did.split(':')[2];
    const expectedPublicKey = Buffer.from(pubKeyHex, 'hex');
    const actualPublicKey = await this.#wallet.getPublicKey();
    return Buffer.compare(expectedPublicKey, actualPublicKey) === 0;
  }

  async signWithDID(did: string, document: Uint8Array): Promise<Uint8Array> {
    const isOwner = await this.verifyDIDOwnership(did);
    if (!isOwner) {
      throw new Error('DID ownership verification failed');
    }
    return this.#wallet.sign(document);
  }
}
