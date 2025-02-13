import { assert } from 'chai';
import { DocumentService } from '../../src/services/document';
import { WalletService } from '../../src/services/wallet';
import { DIDService } from '../../src/services/did';

describe('Signature Verification', () => {
  let documentService: DocumentService;
  let walletService: WalletService;
  let didService: DIDService;

  beforeEach(async () => {
    walletService = new WalletService();
    await walletService.initialize();
    didService = new DIDService(walletService);
    documentService = new DocumentService(walletService, didService);
  });

  describe('Document Signing', () => {
    it('should sign document with valid DID', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const did = await didService.generateDID();
      const signature = await didService.signWithDID(did, document);
      assert.exists(signature);
    });

    it('should verify valid signature', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const did = await didService.generateDID();
      const signature = await didService.signWithDID(did, document);
      const isValid = await walletService.verify(document, signature);
      assert.isTrue(isValid);
    });

    it('should reject invalid signature', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const invalidSignature = new Uint8Array([9, 9, 9]);
      const isValid = await walletService.verify(document, invalidSignature);
      assert.isFalse(isValid);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty document', async () => {
      const emptyDoc = new Uint8Array(0);
      const did = await didService.generateDID();
      try {
        await didService.signWithDID(did, emptyDoc);
        assert.fail('Should have thrown an error');
      } catch (error: any) {
        assert.equal(error.message, 'Empty document');
      }
    });

    it('should handle invalid DID format', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const invalidDID = 'not:a:valid:did';
      try {
        await didService.signWithDID(invalidDID, document);
        assert.fail('Should have thrown an error');
      } catch (error: any) {
        assert.equal(error.message, 'Invalid DID format');
      }
    });
  });
}); 