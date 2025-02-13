import { assert } from 'chai';
import { DocumentService } from '../../src/services/document';
import { WalletService } from '../../src/services/wallet';
import { DIDService } from '../../src/services/did';
import { DIDDocument } from '../../src/types/did.types';

// Test harness to capture all errors
class TestHarness {
  errors: Error[] = [];

  async execute(fn: () => Promise<any>): Promise<{ success: boolean; error?: Error }> {
    try {
      await fn();
      return { success: true };
    } catch (e) {
      this.errors.push(e);
      return { success: false, error: e };
    }
  }

  getLastError(): Error | undefined {
    return this.errors[this.errors.length - 1];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

describe('Signature Verification', () => {
  let documentService: DocumentService;
  let walletService: WalletService;
  let didService: DIDService;
  let harness: TestHarness;

  beforeEach(async () => {
    walletService = new WalletService();
    await walletService.initialize();
    didService = new DIDService(walletService);
    documentService = new DocumentService(walletService, didService);
    harness = new TestHarness();
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
        // Don't assert.fail with our own message
        assert.include(error.message, 'Empty document');
      }
    });

    it('should handle invalid DID format', async () => {
      const document = new Uint8Array([1, 2, 3]);
      const invalidDID = 'not:a:valid:did';
      
      try {
        await didService.signWithDID(invalidDID, document);
        assert.fail('Should have thrown an error');
      } catch (error: any) {
        // Don't assert.fail with our own message
        assert.include(error.message, 'Invalid DID format');
      }
    });
  });
});

describe('DID Service', () => {
  let documentService: DocumentService;
  let walletService: WalletService;
  let didService: DIDService;

  beforeEach(async () => {
    walletService = new WalletService();
    await walletService.initialize();
    didService = new DIDService(walletService);
    documentService = new DocumentService(walletService, didService);
  });

  describe('DID Format Validation', () => {
    it('should validate correct DID format', () => {
      const validDID = 'did:midnight:test123';
      assert.isTrue(didService.isValidDIDFormat(validDID));
    });

    it('should reject invalid DID format', () => {
      const invalidDID = 'not:a:valid:did';
      assert.isFalse(didService.isValidDIDFormat(invalidDID));
    });
  });

  describe('DID Operations', () => {
    it('should create a DID', async () => {
      const did = await didService.createDID();
      assert.exists(did);
      assert.isObject(did);
      assert.property(did, 'id');
      assert.match(did.id, /^did:midnight:/);
    });

    it('should verify a valid DID', async () => {
      const did = await didService.createDID();
      const isValid = await didService.verifyDID(did);
      assert.isTrue(isValid);
    });

    it('should resolve a DID', async () => {
      const validDID = 'did:midnight:test123';
      const result = await didService.resolveDID(validDID);
      assert.exists(result);
      assert.property(result, 'didDocument');
      assert.property(result, 'didResolutionMetadata');
    });

    it('should throw on resolving invalid DID', async () => {
      const invalidDID = 'not:a:valid:did';
      try {
        await didService.resolveDID(invalidDID);
        assert.fail('Should have thrown an error');
      } catch (error: any) {
        assert.include(error.message, 'Invalid DID format');
      }
    });
  });
}); 