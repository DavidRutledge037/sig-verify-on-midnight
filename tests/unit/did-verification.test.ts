import { assert } from 'chai';
import { WalletService } from '../../src/services/wallet';
import { DIDService } from '../../src/services/did';

describe('DID Verification', () => {
  let walletService: WalletService;
  let didService: DIDService;

  beforeEach(() => {
    walletService = new WalletService();
    didService = new DIDService(walletService);
  });

  describe('DID Generation', () => {
    it('should generate valid DID from wallet', async () => {
      const did = await didService.generateDID();
      assert.match(did, /^did:midnight:[a-fA-F0-9]{64}$/);
    });

    it('should link DID to wallet public key', async () => {
      const did = await didService.generateDID();
      const isLinked = await didService.verifyDIDOwnership(did);
      assert.isTrue(isLinked);
    });
  });

  describe('DID-Based Document Signing', () => {
    it('should sign document with DID', async () => {
      const did = await didService.generateDID();
      const document = new Uint8Array([1, 2, 3]);
      const signature = await didService.signWithDID(did, document);
      assert.exists(signature);
    });
  });
}); 