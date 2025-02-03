// Base types
export * from './common.js';
export * from './sdk.js';
export * from './wallet.js';
export * from './kyc.js';
export * from './document.js';
export * from './did.js';
export * from './signature.js';
export * from './crypto.js';
export * from './privacy.js';

// Re-export specific types for convenience
export type { Address } from './common.js';
export type { ZKProof, ShieldedTransaction } from './sdk.js';
export { Contract, msg } from './sdk.js';
export { VerificationLevel } from './kyc.js';
export type { PrivacyConfig, PrivacyOptions, PrivacyLevel } from './privacy.js';

export type {
    DIDDocument,
    VerificationMethod,
    ServiceEndpoint 
} from './did.js';

export type {
    SignatureMetadata,
    SignatureVerification,
    SignatureRequest
} from './signature.js';

// Export other type files as needed 