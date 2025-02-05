export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKey: CryptoKey;
    privateKey?: CryptoKey;
    algorithm: CryptoAlgorithm;
}

export interface DIDDocument {
    '@context': string[];
    id: string;
    controller: string;
    verificationMethod: VerificationMethod[];
    authentication: string[];
    assertionMethod?: string[];
    created: string;
    updated: string;
}

export interface DIDResolutionResult {
    didDocument: DIDDocument;
    didResolutionMetadata: {
        contentType: string;
        error?: string;
    };
}

export interface ServiceEndpoint {
    id: string;
    type: string;
    serviceEndpoint: string;
}

export interface CryptoAlgorithm {
    name: 'ECDSA' | 'RSASSA-PKCS1-v1_5';
    hash: {
        name: 'SHA-256' | 'SHA-384' | 'SHA-512';
    };
} 