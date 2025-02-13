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

  describe('DID Creation and Validation', () => {
    it('should generate valid DID', async () => {
      const did = await didService.generateDID();
      assert.exists(did);
      assert.isTrue(did.startsWith('did:midnight:'));
    });

    it('should validate DID format', () => {
      const validDID = 'did:midnight:1234567890abcdef';
      assert.isTrue(didService.validateDIDFormat(validDID));
    });

    it('should reject invalid DID format', () => {
      const invalidDIDs = [
        'not:a:did',
        'did:wrong:1234',
        'did:midnight:', // too short
        'notadid'
      ];
      
      invalidDIDs.forEach(did => {
        assert.isFalse(didService.validateDIDFormat(did));
      });
    });
  });

  describe('Document Signing', () => {
    it('should sign document with valid DID', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const did = await didService.generateDID();
      const signature = await didService.signWithDID(did, document);
      assert.exists(signature);
    });

    it('should reject empty document', async () => {
      const emptyDoc = new Uint8Array(0);
      const did = await didService.generateDID();
      try {
        await didService.signWithDID(did, emptyDoc);
        assert.fail('Should have thrown an error');
      } catch (error: any) {
        assert.include(error.message, 'Empty document');
      }
    });

    it('should reject invalid DID format', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const invalidDID = 'not:a:valid:did';
      try {
        await didService.signWithDID(invalidDID, document);
        assert.fail('Should have thrown an error');
      } catch (error: any) {
        assert.include(error.message, 'Invalid DID format');
      }
    });
  });
}); 