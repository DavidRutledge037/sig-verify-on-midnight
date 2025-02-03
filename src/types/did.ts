export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase?: string;
    blockchainAccountId?: string;
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