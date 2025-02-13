import { jest } from '@jest/globals';
import type { DIDDocument } from '../../src/types/did.types.js';
import { validateDID, validateKeyPair, validateSignature } from '../../src/utils/validation.js';
import { createMockDIDDocument, createMockKeyPair } from '../utils/test-helpers.js';

describe('Validation', () => {
    describe('DID Validation', () => {
        it('should validate correct DID document', () => {
            // Arrange
            const validDID = createMockDIDDocument();

            // Act
            const result = validateDID(validDID);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject DID without required fields', () => {
            // Arrange
            const invalidDID = {
                id: 'did:midnight:test'
            } as DIDDocument;

            // Act
            const result = validateDID(invalidDID);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing required field: controller');
        });

        it('should validate DID format', () => {
            // Arrange
            const invalidDID = createMockDIDDocument();
            invalidDID.id = 'invalid:did:format';

            // Act
            const result = validateDID(invalidDID);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid DID format');
        });

        it('should validate verification methods', () => {
            // Arrange
            const invalidDID = createMockDIDDocument();
            invalidDID.verificationMethod = [{
                id: '#invalid',
                type: 'Unknown',
                controller: 'invalid:controller',
                publicKeyMultibase: 'invalid'
            }];

            // Act
            const result = validateDID(invalidDID);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid verification method format');
        });

        it('should validate timestamps', () => {
            // Arrange
            const invalidDID = createMockDIDDocument();
            invalidDID.created = 'invalid-date';
            invalidDID.updated = 'invalid-date';

            // Act
            const result = validateDID(invalidDID);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid timestamp format');
        });
    });

    describe('Key Pair Validation', () => {
        it('should validate correct key pair', () => {
            // Arrange
            const validKeyPair = createMockKeyPair();

            // Act
            const result = validateKeyPair(validKeyPair);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate key lengths', () => {
            // Arrange
            const invalidKeyPair = createMockKeyPair();
            invalidKeyPair.publicKey = new Uint8Array([1]); // Too short
            invalidKeyPair.privateKey = new Uint8Array([1]); // Too short

            // Act
            const result = validateKeyPair(invalidKeyPair);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid key length');
        });

        it('should validate key types', () => {
            // Arrange
            const invalidKeyPair = {
                publicKey: 'invalid' as unknown as Uint8Array,
                privateKey: 'invalid' as unknown as Uint8Array
            };

            // Act
            const result = validateKeyPair(invalidKeyPair);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid key type');
        });
    });

    describe('Signature Validation', () => {
        it('should validate correct signature', () => {
            // Arrange
            const validSignature = new Uint8Array(64).fill(1);

            // Act
            const result = validateSignature(validSignature);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate signature length', () => {
            // Arrange
            const invalidSignature = new Uint8Array([1, 2, 3]); // Too short

            // Act
            const result = validateSignature(invalidSignature);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid signature length');
        });

        it('should validate signature type', () => {
            // Arrange
            const invalidSignature = 'invalid' as unknown as Uint8Array;

            // Act
            const result = validateSignature(invalidSignature);

            // Assert
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid signature type');
        });
    });

    describe('Complex Validation', () => {
        it('should validate DID with multiple verification methods', () => {
            // Arrange
            const complexDID = createMockDIDDocument();
            complexDID.verificationMethod = [
                {
                    id: `${complexDID.id}#key-1`,
                    type: 'Ed25519VerificationKey2020',
                    controller: complexDID.id,
                    publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
                },
                {
                    id: `${complexDID.id}#key-2`,
                    type: 'Ed25519VerificationKey2020',
                    controller: complexDID.id,
                    publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
                }
            ];

            // Act
            const result = validateDID(complexDID);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate DID with services', () => {
            // Arrange
            const complexDID = createMockDIDDocument();
            complexDID.service = [
                {
                    id: `${complexDID.id}#service-1`,
                    type: 'DIDCommMessaging',
                    serviceEndpoint: 'https://example.com/endpoint'
                }
            ];

            // Act
            const result = validateDID(complexDID);

            // Assert
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });
}); 