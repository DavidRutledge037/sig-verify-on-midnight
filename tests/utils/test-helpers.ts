import { DIDDocument, VerificationMethod, ServiceEndpoint } from '../../src/types/did.types';
import { randomBytes } from 'crypto';

export const createMockDIDDocument = (
    id: string = `did:midnight:${randomBytes(8).toString('hex')}`,
    controller: string = randomBytes(20).toString('hex')
): DIDDocument => {
    const verificationMethod: VerificationMethod = {
        id: `${id}#key-1`,
        type: 'Ed25519VerificationKey2020',
        controller: id,
        publicKeyHex: randomBytes(32).toString('hex')
    };

    const service: ServiceEndpoint = {
        id: `${id}#service-1`,
        type: 'DIDCommMessaging',
        serviceEndpoint: 'https://example.com/endpoint'
    };

    return {
        id,
        controller,
        verificationMethod: [verificationMethod],
        authentication: [`${id}#key-1`],
        assertionMethod: [`${id}#key-1`],
        keyAgreement: [],
        capabilityInvocation: [`${id}#key-1`],
        capabilityDelegation: [],
        service: [service],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        status: 'active'
    };
};

export const createMockKeyPair = () => ({
    publicKey: new Uint8Array(randomBytes(32)),
    privateKey: new Uint8Array(randomBytes(32))
});

export const createMockProof = (creator: string = randomBytes(20).toString('hex')) => ({
    type: 'TestProof',
    created: new Date().toISOString(),
    creator,
    signatureValue: new Uint8Array(randomBytes(64)),
    data: {
        test: 'data'
    }
});

export const waitForTimeout = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms)); 