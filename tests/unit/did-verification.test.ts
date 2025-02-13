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
    it('should create valid DID', async () => {
      const didDoc = await didService.createDID();
      assert.exists(didDoc);
      assert.isTrue(didDoc.id.startsWith('did:midnight:'));
    });

    it('should verify created DID', async () => {
      const didDoc = await didService.createDID();
      const isValid = await didService.verifyDID(didDoc);
      assert.isTrue(isValid);
    });
  });

  describe('DID Format Validation', () => {
    it('should validate correct DID format', () => {
      const validDID = 'did:midnight:1234567890abcdef';
      assert.isTrue(didService.isValidDIDFormat(validDID));
    });

    it('should reject invalid DID format', () => {
      const invalidDIDs = [
        'not:a:did',
        'did:wrong:1234',
        'did:midnight:', // too short
        'notadid'
      ];
      
      invalidDIDs.forEach(did => {
        assert.isFalse(didService.isValidDIDFormat(did));
      });
    });
  });

  describe('DID Resolution', () => {
    it('should resolve valid DID', async () => {
      const validDID = 'did:midnight:1234567890abcdef';
      const result = await didService.resolve(validDID);
      assert.exists(result);
      assert.property(result, 'didDocument');
      assert.property(result, 'didResolutionMetadata');
    });

    it('should reject invalid DID format during resolution', async () => {
      const invalidDID = 'not:a:valid:did';
      try {
        await didService.resolve(invalidDID);
        assert.fail('Should have thrown an error');
      } catch (error: any) {
        assert.equal(error.message, 'Invalid DID format');
      }
    });
  });
}); 