import { jest, describe, it, expect } from '@jest/globals';
import { ValidationService } from '../../src/services/validation';

describe('Validation Unit Tests', () => {
    let validationService: ValidationService;

    beforeEach(() => {
        validationService = new ValidationService();
    });

    it('should validate DID format', () => {
        expect(validationService.isValidDID('did:midnight:test')).toBe(true);
        expect(validationService.isValidDID('invalid:did')).toBe(false);
        expect(validationService.isValidDID('')).toBe(false);
    });

    it('should validate proof format', () => {
        const validProof = {
            type: 'test',
            value: 'test-value'
        };
        
        expect(validationService.isValidProof(validProof)).toBe(true);
        expect(validationService.isValidProof({})).toBe(false);
        expect(validationService.isValidProof(null)).toBe(false);
    });

    // ... rest of tests ...
}); 