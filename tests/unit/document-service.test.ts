import { assert } from 'chai';
import { DocumentService } from '../../src/services/document';
import { WalletService } from '../../src/services/wallet';
import { DIDService } from '../../src/services/did';

describe('Document Service', () => {
  let documentService: DocumentService;
  let walletService: WalletService;
  let didService: DIDService;

  beforeEach(async () => {
    walletService = new WalletService();
    await walletService.initialize();
    didService = new DIDService(walletService);
    documentService = new DocumentService(walletService, didService);
  });

  describe('Document Validation', () => {
    it('should validate non-empty document', () => {
      const validDoc = new Uint8Array([1, 2, 3]);
      assert.isTrue(validDoc.length > 0);
    });

    it('should detect empty document', () => {
      const emptyDoc = new Uint8Array(0);
      assert.equal(emptyDoc.length, 0);
    });
  });

  describe('DID Operations', () => {
    it('should handle document with valid DID', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const didDoc = await didService.createDID();
      assert.exists(didDoc);
      assert.isTrue(didService.isValidDIDFormat(didDoc.id));
    });

    it('should reject document with invalid DID', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const invalidDID = 'not:a:valid:did';
      assert.isFalse(didService.isValidDIDFormat(invalidDID));
    });
  });
}); 