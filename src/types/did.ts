export interface DIDDocument {
    '@context': string[];
    id: string;
    controller: string[];
    verificationMethod: VerificationMethod[];
    authentication: string[];
    assertionMethod: string[];
    service: ServiceEndpoint[];
}

export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase?: string;
}

export interface ServiceEndpoint {
    id: string;
    type: string;
    serviceEndpoint: string;
} 